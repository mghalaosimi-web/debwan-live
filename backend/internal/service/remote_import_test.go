package service

import (
	"context"
	"net"
	"net/url"
	"testing"
)

func TestIsPubliclyRoutableIP(t *testing.T) {
	tests := []struct {
		name string
		ip   string
		want bool
	}{
		{name: "public ipv4", ip: "8.8.8.8", want: true},
		{name: "public ipv6", ip: "2001:4860:4860::8888", want: true},
		{name: "loopback", ip: "127.0.0.1", want: false},
		{name: "private ipv4", ip: "10.0.0.2", want: false},
		{name: "private ipv6", ip: "fd00::1", want: false},
		{name: "link local", ip: "169.254.169.254", want: false},
		{name: "multicast", ip: "224.0.0.1", want: false},
		{name: "unspecified", ip: "0.0.0.0", want: false},
		{name: "carrier grade nat", ip: "100.64.0.1", want: false},
		{name: "documentation ipv4", ip: "192.0.2.10", want: false},
		{name: "documentation ipv6", ip: "2001:db8::1", want: false},
		{name: "nil", ip: "", want: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var ip net.IP
			if tt.ip != "" {
				ip = net.ParseIP(tt.ip)
			}
			if got := isPubliclyRoutableIP(ip); got != tt.want {
				t.Fatalf("isPubliclyRoutableIP(%q) = %v, want %v", tt.ip, got, tt.want)
			}
		})
	}
}

func TestValidateRemoteImportURLRejectsUnsafeURLs(t *testing.T) {
	tests := []struct {
		name string
		raw  string
	}{
		{name: "http is disabled", raw: "http://example.com/playlist.m3u"},
		{name: "localhost", raw: "https://localhost/playlist.m3u"},
		{name: "localhost subdomain", raw: "https://service.localhost/playlist.m3u"},
		{name: "local suffix", raw: "https://internal.local/playlist.m3u"},
		{name: "metadata host", raw: "https://metadata.google.internal/computeMetadata/v1/"},
		{name: "loopback ipv4", raw: "https://127.0.0.1/playlist.m3u"},
		{name: "loopback ipv6", raw: "https://[::1]/playlist.m3u"},
		{name: "private address", raw: "https://192.168.1.1/playlist.m3u"},
		{name: "link local metadata", raw: "https://169.254.169.254/latest/meta-data/"},
		{name: "non standard port", raw: "https://example.com:8443/playlist.m3u"},
		{name: "embedded credentials", raw: "https://user:pass@example.com/playlist.m3u"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			parsed, err := url.Parse(tt.raw)
			if err != nil {
				t.Fatalf("url.Parse: %v", err)
			}
			if err := validateRemoteImportURL(context.Background(), parsed); err == nil {
				t.Fatalf("expected %q to be rejected", tt.raw)
			}
		})
	}
}

func TestFetchRemoteImportRejectsBeforeNetworkAccess(t *testing.T) {
	_, _, err := fetchRemoteImport(context.Background(), newSafeRemoteHTTPClient(), "http://127.0.0.1/private", 1024)
	if err == nil {
		t.Fatal("expected unsafe URL to be rejected")
	}
}
