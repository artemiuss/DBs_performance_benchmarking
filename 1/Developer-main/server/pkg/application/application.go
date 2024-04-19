package application

import (
	"github.com/TransactionServices/Developer/pkg/config"
	"github.com/TransactionServices/Developer/pkg/logger"
	"github.com/TransactionServices/Developer/pkg/session"
	"go.uber.org/zap"
	"net/http"
)

// Application holds commonly used app wide services, for ease of Dependency Injection
type Application struct {
	Config         *config.Config
	SessionStore   *session.Store
	ProxyTransport http.RoundTripper
	Logger         *zap.SugaredLogger
}

func Get() (*Application, error) {
	a := &Application{}

	cfg, err := config.Get(".env", "../../")
	if err != nil {
		return nil, err
	}

	appLogger, err := logger.Initialize(cfg.Env)
	if err != nil {
		return nil, err
	}
	a.Logger = appLogger

	err = a.SessionStore.NewStore(*cfg)
	if err != nil {
		return nil, err
	}

	a.ProxyTransport = http.DefaultTransport

	a.Config = cfg
	return a, nil
}
