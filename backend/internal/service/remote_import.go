package service

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type remoteImportFunc func(context.Context, *http.Client, string, int64) ([]byte, http.Header, error)

const maxRemoteRedirects = 3

// newSafeRemoteHTTPClient pins each outbound connection to a freshly resolved,
// publicly routable IP. Redirects are revalidated and DNS is resolved again
// at dial time, preventing redirect-based SSRF and DNS-rebinding to private IPs.
func newSafeRemoteHTTPClient() *http.Client {
	dialer := &net.Dialer{Timeout: 10 * time.Second, KeepAlive: 30 * time.Second}
	transport := &http.Transport{
		Proxy:                 nil,
		DisableCompression:    true,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 15 * time.Second,
		IdleConnTimeout:       30 * time.Second,
		DialContext: func(ctx context.Context, network, address string) (net.Conn, error) {
			host, port, err := net.SplitHostPort(address)
			if err != nil {
				return nil, fmt.Errorf("invalid remote address: %w", err)
			}
			if port != "443" {
				return nil, fmt.Errorf("remote import only permits HTTPS port 443")
			}
			ips, err := resolvePublicIPs(ctx, host)
			if err != nil {
				return nil, err
			}
			var lastErr error
			for _, ip := range ips {
				conn, dialErr := dialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
				if dialErr == nil {
					return conn, nil
				}
				lastErr = dialErr
			}
			return nil, fmt.Errorf("could not connect to validated public host: %w", lastErr)
		},
	}
	return &http.Client{
		Transport: transport,
		Timeout:   90 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= maxRemoteRedirects {
				return fmt.Errorf("too many redirects")
			}
			return validateRemoteImportURL(req.Context(), req.URL)
		},
	}
}

func validateRemoteImportURL(ctx context.Context, parsed *url.URL) error {
	if parsed == nil || parsed.Scheme != "https" || parsed.User != nil {
		return fmt.Errorf("remote imports require an HTTPS URL without credentials")
	}
	if parsed.Hostname() == "" {
		return fmt.Errorf("remote import URL has no hostname")
	}
	if port := parsed.Port(); port != "" && port != "443" {
		return fmt.Errorf("remote imports only permit HTTPS port 443")
	}
	return validatePublicHost(ctx, parsed.Hostname())
}

func validatePublicHost(ctx context.Context, host string) error {
	host = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(host)), ".")
	if host == "" || host == "localhost" || strings.HasSuffix(host, ".localhost") ||
		strings.HasSuffix(host, ".local") || host == "metadata.google.internal" ||
		host == "metadata.azure.internal" || host == "instance-data.ec2.internal" {
		return fmt.Errorf("local or metadata host is blocked")
	}
	_, err := resolvePublicIPs(ctx, host)
	return err
}

func resolvePublicIPs(ctx context.Context, host string) ([]net.IP, error) {
	if literal := net.ParseIP(strings.Trim(host, "[]")); literal != nil {
		if !isPubliclyRoutableIP(literal) {
			return nil, fmt.Errorf("non-public destination IP is blocked: %s", literal)
		}
		return []net.IP{literal}, nil
	}
	records, err := net.DefaultResolver.LookupIPAddr(ctx, host)
	if err != nil {
		return nil, fmt.Errorf("could not resolve remote host %q: %w", host, err)
	}
	if len(records) == 0 {
		return nil, fmt.Errorf("remote host %q resolved to no addresses", host)
	}
	ips := make([]net.IP, 0, len(records))
	for _, record := range records {
		if !isPubliclyRoutableIP(record.IP) {
			return nil, fmt.Errorf("remote host %q resolved to blocked IP %s", host, record.IP)
		}
		ips = append(ips, record.IP)
	}
	return ips, nil
}

func isPubliclyRoutableIP(ip net.IP) bool {
	if ip == nil || !ip.IsGlobalUnicast() || ip.IsPrivate() || ip.IsLoopback() ||
		ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() || ip.IsMulticast() || ip.IsUnspecified() {
		return false
	}
	ranges := []string{
		"0.0.0.0/8", "100.64.0.0/10", "192.0.0.0/24", "192.0.2.0/24",
		"192.88.99.0/24", "198.18.0.0/15", "198.51.100.0/24",
		"203.0.113.0/24", "224.0.0.0/4", "240.0.0.0/4",
		"64:ff9b::/96", "100::/64", "2001:db8::/32", "2001::/23",
	}
	for _, block := range ranges {
		_, subnet, err := net.ParseCIDR(block)
		if err == nil && subnet.Contains(ip) {
			return false
		}
	}
	return true
}

func fetchRemoteImport(ctx context.Context, client *http.Client, rawURL string, maxBytes int64) ([]byte, http.Header, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid remote import URL: %w", err)
	}
	if err := validateRemoteImportURL(ctx, parsed); err != nil {
		return nil, nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, parsed.String(), nil)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Accept", "application/x-mpegURL, application/vnd.apple.mpegurl, application/xml, text/xml, text/plain, application/gzip, */*")
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, nil, fmt.Errorf("remote import returned HTTP %d", resp.StatusCode)
	}
	if resp.ContentLength > maxBytes {
		return nil, nil, fmt.Errorf("remote import exceeds %d bytes", maxBytes)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxBytes+1))
	if err != nil {
		return nil, nil, err
	}
	if int64(len(body)) > maxBytes {
		return nil, nil, fmt.Errorf("remote import exceeds %d bytes", maxBytes)
	}
	return body, resp.Header.Clone(), nil
}
