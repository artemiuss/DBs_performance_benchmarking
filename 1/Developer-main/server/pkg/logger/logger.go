package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func Initialize(env string) (*zap.SugaredLogger, error) {
	cfg := zap.NewProductionConfig()
	// set log level to Debug for certain environments
	if env == "dev" && env == "local" {
		cfg.Level = zap.NewAtomicLevelAt(zapcore.DebugLevel)
	}
	cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	cfg.InitialFields = map[string]interface{}{
		"env": env,
	}
	logger, err := cfg.Build()
	if err != nil {
		return nil, err
	}
	return logger.Sugar(), nil
}
