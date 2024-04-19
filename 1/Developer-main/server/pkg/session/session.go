package session

import (
	"encoding/base64"
	"encoding/gob"
	"errors"
	"github.com/TransactionServices/Developer/pkg/config"
	"github.com/gorilla/sessions"
	"net/http"
)

type Store struct{}

// wrapping Gorilla sessions implementation for ease of future replacement
var gorillaStore *sessions.CookieStore

func (s *Store) NewStore(c config.Config) (err error) {
	key, err := base64.StdEncoding.DecodeString(c.Session.Secret)
	if err != nil {
		return err
	}

	// initialize gorilla session store
	gorillaStore = sessions.NewCookieStore(key)
	gob.Register(map[string]interface{}{})

	gorillaStore.Options = &sessions.Options{
		MaxAge:   c.Session.MaxAge,
		HttpOnly: c.Session.HttpOnly,
		Path:     c.Session.Path,
		Secure:   c.Session.Secure,
	}
	return nil
}

func (s *Store) Get(r *http.Request) (interface{}, error) {
	session, err := gorillaStore.Get(r, "session")
	if err != nil {
		return nil, err
	}

	if session.IsNew {
		return nil, errors.New("invalid session")
	}
	return session.Values["details"], nil
}

func (s *Store) Create(w http.ResponseWriter, r *http.Request, details interface{}) error {
	session, err := gorillaStore.Get(r, "session")
	if err != nil {
		return err
	}

	session.Values["details"] = details
	err = session.Save(r, w)
	if err != nil {
		return err
	}
	return nil
}

// in the gorilla implementation, Create and Update logic is identical
func (s *Store) Update(w http.ResponseWriter, r *http.Request, details interface{}) error {
	session, err := gorillaStore.Get(r, "session")
	if err != nil {
		return err
	}

	session.Values["details"] = details
	err = session.Save(r, w)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) Delete(w http.ResponseWriter, r *http.Request) error {
	session, err := gorillaStore.Get(r, "session")
	if err != nil {
		return err
	}

	// negative max age expires the session
	session.Options.MaxAge = -1
	err = session.Save(r, w)
	if err != nil {
		return err
	}
	return nil
}
