package handlers

import (
	"encoding/json"
	"errors"
	"github.com/TransactionServices/Developer/cmd/api/models"
	"github.com/TransactionServices/Developer/pkg/application"
	"log"
	"net/http"
)

func Logon(app *application.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginReq models.UserLoginRequest
		err := json.NewDecoder(r.Body).Decode(&loginReq)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		// make user lookup request to TRX API.
		clientId, err := models.TrxUserLookup(app, loginReq.Username)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		// Logon via TRX API
		userSession, err := models.TrxLogon(app, loginReq.Username, loginReq.Password, clientId)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		userSession.ApiCreds.Client = clientId

		// create session cookie
		err = app.SessionStore.Create(w, r, userSession)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		resp := models.UserLogonResponse{
			FirstName: userSession.FirstName,
			LastName:  userSession.LastName,
			Email:     userSession.Email,
			ApiCreds:  userSession.ApiCreds,
		}

		w.Header().Add("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(&resp)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		return
	}
}

func RequestAccess(app *application.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// Decode request json into struct
		var reqInfo models.UserAccessRequest
		err := json.NewDecoder(r.Body).Decode(&reqInfo)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		// send lead insert
		err = models.TrxLeadInsert(app, reqInfo)
		if err != nil {
			app.Logger.Errorw(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	}
}

func IsAuthenticated(app *application.Application) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := app.SessionStore.Get(r)
		if err != nil {
			app.Logger.Warnw(err.Error())
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		details, ok := session.(models.UserSessionDetails)
		if !ok {
			app.Logger.Errorw(err.Error())
			log.Println(errors.New("cannot cast session interface to details"))
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		if !details.Authenticated {
			app.Logger.Warnw("user session is not authenticated")
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}
}
