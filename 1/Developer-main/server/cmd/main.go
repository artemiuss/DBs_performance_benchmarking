package main

import (
	"encoding/gob"
	"github.com/TransactionServices/Developer/cmd/api/models"
	"github.com/TransactionServices/Developer/cmd/api/router"
	"github.com/TransactionServices/Developer/pkg/application"
	"github.com/rs/cors"
	"github.com/unrolled/secure"
	"log"
	"net/http"
)

func main() {
	app, err := application.Get()
	if err != nil {
		panic(err)
	}

	gob.Register(models.UserSessionDetails{})

	// only allow cors for local development
	if app.Config.Env == "local" {
		c := cors.New(cors.Options{
			// :5173 is for React+Vite dev server, :8000 is for Mkdocs dev server
			AllowedOrigins:   []string{"http://localhost:5173", "http://0.0.0.0:8000"},
			AllowCredentials: true,
		})
		handler := c.Handler(router.Get(app))
		app.Logger.Infow("dev portal started and listening via Http on :3000")
		log.Fatal(http.ListenAndServe(":3000", handler))
	} else {
		secureMiddleware := secure.New(secure.Options{
			HostsProxyHeaders:     []string{"X-Forwarded-Host"},
			SSLRedirect:           true,
			STSSeconds:            31536000,
			STSIncludeSubdomains:  true,
			STSPreload:            true,
			FrameDeny:             true,
			ContentTypeNosniff:    true,
			BrowserXssFilter:      true,
			ContentSecurityPolicy: "script-src 'self' unpkg.com 'unsafe-inline'",
		})
		routes := secureMiddleware.Handler(router.Get(app))
		app.Logger.Infow("dev portal started and listening via Https on :3000")
		log.Fatal(http.ListenAndServeTLS(":3000", "./certs/ssl.crt", "./certs/ssl.key", routes))
	}
}
