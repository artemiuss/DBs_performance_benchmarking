package middleware

import (
	"errors"
	"github.com/TransactionServices/Developer/cmd/api/models"
	"github.com/TransactionServices/Developer/pkg/application"
	"log"
	"net/http"
)

func IsAuthorized(app *application.Application) func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := app.SessionStore.Get(r)
			if err != nil {
				log.Println(err.Error())
				http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
				return
			}

			details, ok := session.(models.UserSessionDetails)
			if !ok {
				log.Println(errors.New("cannot cast session interface to details"))
				http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
				return
			}

			if !details.Authenticated {
				http.Redirect(w, r, "/", http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
