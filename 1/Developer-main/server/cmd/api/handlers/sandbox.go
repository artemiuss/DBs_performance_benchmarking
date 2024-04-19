package handlers

import (
	"errors"
	"github.com/TransactionServices/Developer/pkg/application"
	"github.com/fatih/camelcase"
	"github.com/gorilla/mux"
	"io"
	"net/http"
	"os"
)

func SandboxGateway(app *application.Application) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// get the port, if supplied.
		// this is needed for internal D.N.S. for the TRX API calls
		port := ""
		if app.Config.TrxAPI.Port != "" {
			port += ":" + app.Config.TrxAPI.Port
		}

		// Create a new HTTP request with the same method, URL, and body as the original request
		targetURL := app.Config.TrxAPI.Host + port + "/json"
		proxyReq, err := http.NewRequest(r.Method, targetURL, r.Body)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, "Error creating proxy request", http.StatusInternalServerError)
			return
		}

		// Copy the headers from the original request to the proxy request
		for name, values := range r.Header {
			for _, value := range values {
				if name != "Content-Length" {
					proxyReq.Header.Add(name, value)
				} else {
					// if this is not set, the new http request sets a Content-Length of 0, and TRX throws HTTP 400
					proxyReq.ContentLength = r.ContentLength
				}
			}
		}

		resp, err := app.ProxyTransport.RoundTrip(proxyReq)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, "Error sending proxy request", http.StatusInternalServerError)
			return
		}
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				app.Logger.Errorw(err.Error())
			}
		}(resp.Body)

		// Copy the headers from the proxy response to the original response
		for name, values := range resp.Header {
			for _, value := range values {
				w.Header().Add(name, value)
			}
		}

		// Set the status code of the original response to the status code of the proxy response
		w.WriteHeader(resp.StatusCode)

		// Copy the body of the proxy response to the original response
		_, err = io.Copy(w, resp.Body)
		if err != nil {
			app.Logger.Errorw(err.Error())
		}
	}
}

func SandboxOpenApi(app *application.Application) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// get the operation ID from url path
		opID := mux.Vars(r)["id"]

		// split the operation ID for use in title field of yaml
		split := camelcase.Split(opID)
		var opTitle string
		for _, str := range split {
			opTitle += str + " "
		}

		// check if operation is valid (necessary schema files exist)
		_, err := os.Open("../../static-api/" + opID + "/" + opID + ".json")
		if errors.Is(err, os.ErrNotExist) {
			app.Logger.Warnw(err.Error())
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		// TODO: only include reponse schema in yaml if it exists (some operations don't have a separate response)
		_, err = os.Open("../../static-api/" + opID + "Response/" + opID + "Response.json")
		if errors.Is(err, os.ErrNotExist) {
			app.Logger.Warnw(err.Error())
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		// fill in yaml details accordingly
		content :=
			`openapi: 3.0.0
info:
  title: ` + opTitle + `
servers:
  - url: '` + app.Config.TrxAPI.Host + `'
security:
  - basicAuth: []
paths:
  /json:
    post:
      summary: ` + opTitle + `
      operationId: ` + opID + `
      requestBody:
        content:
          application/json:
            schema:
              $ref: >-
                ../sandbox-assets/` + opID + `/` + opID + `.json#/definitions/TopLevelRequestObject
      responses:
        '200':
          description: Response returned by the TRX API.
          content:
            application/json:
              schema:
                $ref: >-
                  ../sandbox-assets/` + opID + `Response/` + opID + `Response.json#/definitions/TopLevelRequestObject
components:
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
`
		// return yaml contents to client
		w.Header().Set("Content-Type", "application/x-yaml")
		_, err = w.Write([]byte(content))
		if err != nil {
			app.Logger.Errorw(err.Error())
		}
		return
	}
}
