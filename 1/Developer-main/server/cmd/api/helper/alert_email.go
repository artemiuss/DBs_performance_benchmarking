package helper

import (
	"fmt"
	"github.com/TransactionServices/Developer/pkg/application"
	"net/smtp"
)

func SendAlertEmail(app *application.Application, content string) {
	sender := app.Config.Smtp.Sender
	recipient := app.Config.Smtp.Recipient
	host := app.Config.Smtp.Host
	port := app.Config.Smtp.Port
	password := app.Config.Smtp.Password
	environment := app.Config.Env

	// Receiver email address.
	to := []string{
		recipient,
	}

	// Message.
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + environment + " [Dev-Portal] " + content + "\r\n" +
		"\r\n" +
		"Environment: " + environment +
		"\r\n" +
		content +
		"\r\n" +
		"\r\n" +
		"- Sent automatically by the Dev Portal.")

	// Authentication.
	auth := smtp.PlainAuth("", sender, password, host)

	// Sending email.
	err := smtp.SendMail(host+":"+port, auth, sender, to, message)
	if err != nil {
		fmt.Println(err)
		return
	}
}
