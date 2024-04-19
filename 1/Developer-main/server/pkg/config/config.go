package config

import (
	"github.com/joho/godotenv"
	"strconv"
)

type Config struct {
	Env     string
	TrxAPI  TrxAPI
	Smtp    SMTP
	Session Session
}

type TrxAPI struct {
	Host       string
	Port       string
	AuthClient TrxClient
	LeadClient TrxClient
}

type TrxClient struct {
	Username string
	Password string
}

type SMTP struct {
	Sender    string
	Recipient string
	Host      string
	Port      string
	Password  string
}

type Session struct {
	MaxAge   int
	HttpOnly bool
	Path     string
	Secure   bool
	Secret   string
}

// using godotenv implementation for now, but could easily swap to something else as needed
func Get(fName string, fPath string) (*Config, error) {
	return GetWithGoDotEnv(fName, fPath)
}

func GetWithGoDotEnv(fName string, fPath string) (*Config, error) {
	appEnv, err := godotenv.Read(fPath + fName)
	if err != nil {
		return nil, err
	}

	maxAge, err := strconv.Atoi(appEnv["SESSION_MAX_AGE"])
	if err != nil {
		return nil, err
	}
	httpOnly, err := strconv.ParseBool(appEnv["SESSION_HTTP_ONLY"])
	if err != nil {
		return nil, err
	}
	secure, err := strconv.ParseBool(appEnv["SESSION_SECURE"])
	if err != nil {
		return nil, err
	}

	return &Config{
		Env: appEnv["ENV"],
		TrxAPI: TrxAPI{
			Host: appEnv["HOST"],
			Port: appEnv["PORT"],
			AuthClient: TrxClient{
				Username: appEnv["TRX_AUTH_CLIENT_USERNAME"],
				Password: appEnv["TRX_AUTH_CLIENT_PASSWORD"],
			},
			LeadClient: TrxClient{
				Username: appEnv["TRX_LEAD_CLIENT_USERNAME"],
				Password: appEnv["TRX_LEAD_CLIENT_PASSWORD"],
			},
		},
		Smtp: SMTP{
			Sender:    appEnv["EMAIL_SENDER"],
			Recipient: appEnv["EMAIL_RECIPIENT"],
			Host:      appEnv["EMAIL_SMTP_HOST"],
			Port:      appEnv["EMAIL_SMTP_PORT"],
			Password:  appEnv["EMAIL_SMTP_PASSWORD"],
		},
		Session: Session{
			MaxAge:   maxAge,
			HttpOnly: httpOnly,
			Path:     appEnv["SESSION_PATH"],
			Secure:   secure,
			Secret:   appEnv["SESSION_SECRET"],
		},
	}, nil
}
