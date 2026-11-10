package router

import (
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/tivify/backend/internal/util"
)

func TestAdminRoutesRequireAuthentication(t *testing.T) {
	util.InitJWT("router-test-secret-at-least-32-characters", 15*time.Minute)

	app := fiber.New()
	SetupAPIv1(app, &Handlers{})

	req := httptest.NewRequest("GET", "/api/v1/admin/dashboard/stats", nil)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want %d for unauthenticated admin request", resp.StatusCode, fiber.StatusUnauthorized)
	}
}

func TestAdminRoutesRejectAuthenticatedNonAdmin(t *testing.T) {
	util.InitJWT("router-test-secret-at-least-32-characters", 15*time.Minute)

	token, err := util.GenerateAccessToken(uuid.New(), "user")
	if err != nil {
		t.Fatalf("failed to generate user token: %v", err)
	}

	app := fiber.New()
	SetupAPIv1(app, &Handlers{})

	req := httptest.NewRequest("GET", "/api/v1/admin/dashboard/stats", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want %d for non-admin user", resp.StatusCode, fiber.StatusForbidden)
	}
}
func TestPersonalUserRoutesRequireAuthentication(t *testing.T) {
	util.InitJWT("router-test-secret-at-least-32-characters", 15*time.Minute)

	app := fiber.New()
	SetupAPIv1(app, &Handlers{})

	for _, path := range []string{
		"/api/v1/favorites",
		"/api/v1/history",
	} {
		req := httptest.NewRequest("GET", path, nil)
		resp, err := app.Test(req, -1)
		if err != nil {
			t.Fatalf("request to %s failed: %v", path, err)
		}
		resp.Body.Close()
		if resp.StatusCode != fiber.StatusUnauthorized {
			t.Fatalf("GET %s status = %d, want %d", path, resp.StatusCode, fiber.StatusUnauthorized)
		}
	}
}
