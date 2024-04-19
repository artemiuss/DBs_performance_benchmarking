package router

import (
	"github.com/TransactionServices/Developer/cmd/api/handlers"
	"github.com/TransactionServices/Developer/pkg/application"
	"github.com/TransactionServices/Developer/pkg/middleware"
	"github.com/gorilla/mux"
	"net/http"
)

func Get(app *application.Application) *mux.Router {
	r := mux.NewRouter()

	// serve the compiled static docs (material mkdocs will use the "static-docs" as its output directory)
	docs := r.PathPrefix("/docs/").Subrouter()
	docs.Use(middleware.IsAuthorized(app))
	docs.PathPrefix("").Handler(http.StripPrefix("/docs/", http.FileServer(http.Dir("../../static-docs"))))

	// serve API for Developer Portal (e.g. logon, logoff, etc.)
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/logon", handlers.Logon(app)).Methods("POST")
	api.HandleFunc("/request-access", handlers.RequestAccess(app)).Methods("POST")
	api.HandleFunc("/authenticated", handlers.IsAuthenticated(app)).Methods("GET")
	api.HandleFunc("/sandbox/{id}", handlers.SandboxOpenApi(app)).Methods("GET")
	api.HandleFunc("/sandbox-gateway", handlers.SandboxGateway(app)).Methods("POST")
	api.PathPrefix("/sandbox-assets/").Handler(http.StripPrefix("/api/sandbox-assets/", http.FileServer(http.Dir("../../static-api"))))

	// serve client React code (e.g. landing page, login page, sandbox, etc.)
	spa := handlers.SpaHandler{StaticPath: "../../static", IndexPath: "index.html", App: app}
	r.PathPrefix("/").Handler(spa)
	return r
}
