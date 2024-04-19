package models

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"github.com/TransactionServices/Developer/pkg/application"
	"io"
	"log"
	"net/http"
)

type TrxApiRequest struct {
	Message TrxRequestMessage `json:"Message"`
}

type TrxApiResponse struct {
	Message TrxResponseMessage `json:"Message"`
}

type TrxRequestMessage struct {
	Request TrxRequest `json:"Request"`
}

type TrxResponseMessage struct {
	Response TrxResponse `json:"Response"`
}

type TrxRequest struct {
	Detail     TrxDetail      `json:"Detail"`
	User       *TrxUser       `json:"User,omitempty"`
	UserInfo   *TrxUserInfo   `json:"UserInfo,omitempty"`
	Lead       *TrxLead       `json:"Lead,omitempty"`
	ClientInfo *TrxClientInfo `json:"ClientInfo,omitempty"`
	Contact    *TrxContact    `json:"Contact,omitempty"`
	Reference  *TrxReference  `json:"Reference,omitempty"`
}

type TrxDetail struct {
	TranType   string `json:"TranType"`
	TranAction string `json:"TranAction"`
}

type TrxUser struct {
	UserName string `json:"UserName"`
	Password string `json:"Password"`
}

type TrxResponse struct {
	Reference     TrxReference      `json:"Reference"`
	Result        TrxResult         `json:"Result"`
	User          TrxUserResponse   `json:"User"`
	Src           *TrxSrcObject     `json:"Src"`
	QueryResponse *TrxQueryResponse `json:"QueryResponse,omitempty"`
}

type TrxResult struct {
	ResponseCode string `json:"ResponseCode"`
	ResponseText string `json:"ResponseText"`
}

type TrxReference struct {
	Guid   string `json:"Guid,omitempty"`
	Client string `json:"Client,omitempty"`
}

type TrxUserResponse struct {
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Email     string `json:"Email"`
	Token     string `json:"Token"`
}

type TrxQueryResponse struct {
	UserInfo *TrxUserInfo `json:"UserInfo,omitempty"`
}

type TrxUserInfo struct {
	UserName string `json:"UserName,omitempty"`
	Client   string `json:"client,omitempty"`
}

type TrxSrcObject struct {
	Crypt struct {
		Source string
		Token  string
	}
}

type TrxLead struct {
	LeadState string
}

type TrxClientInfo struct {
	Dba   string
	Phone string
	Email string
}

type TrxContact struct {
	Role         string
	ContactOrder string
	FirstName    string
	LastName     string
}

func basicAuth(username string, password string) string {
	auth := username + ":" + password
	return base64.StdEncoding.EncodeToString([]byte(auth))
}

func TrxLogon(app *application.Application, username string, password string, clientID string) (*UserSessionDetails, error) {
	// Reference/Client is only supported for UserLogon with the master credentials.
	// In local environment, we may not have access to master creds,
	// so we only add this to the request in a non local environment.
	var reference *TrxReference
	if app.Config.Env != "local" {
		reference = &TrxReference{
			Client: clientID,
		}
	}

	apiReq := &TrxApiRequest{
		Message: TrxRequestMessage{
			Request: TrxRequest{
				Detail: TrxDetail{
					TranType:   "User",
					TranAction: "Logon",
				},
				User: &TrxUser{
					UserName: username,
					Password: password,
				},
				Reference: reference,
			},
		},
	}

	body, err := json.Marshal(apiReq)
	if err != nil {
		return nil, err
	}

	// get the port, if supplied.
	// this is needed for internal D.N.S.
	port := ""
	if app.Config.TrxAPI.Port != "" {
		port += ":" + app.Config.TrxAPI.Port
	}

	// Create the http post request
	r, err := http.NewRequest("POST", app.Config.TrxAPI.Host+port+"/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", "Basic "+basicAuth(app.Config.TrxAPI.AuthClient.Username, app.Config.TrxAPI.AuthClient.Password))

	// Create client and make request
	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			app.Logger.Errorw(err.Error())
			return
		}
	}(res.Body)

	respBody := TrxApiResponse{}
	err = json.NewDecoder(res.Body).Decode(&respBody)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK || respBody.Message.Response.Result.ResponseCode != "00" {
		return nil, errors.New("user logon failed with GUID - " + respBody.Message.Response.Reference.Guid)
	}

	app.Logger.Info("user logon succeeded with Guid - " + respBody.Message.Response.Reference.Guid)

	return &UserSessionDetails{
		FirstName:     respBody.Message.Response.User.FirstName,
		LastName:      respBody.Message.Response.User.LastName,
		Email:         respBody.Message.Response.User.Email,
		Authenticated: true,
		ApiCreds: UserTrxApiCreds{
			Client: "",
			Source: respBody.Message.Response.Src.Crypt.Source,
			Token:  respBody.Message.Response.Src.Crypt.Token,
		},
	}, nil
}

func TrxUserLookup(app *application.Application, username string) (string, error) {
	apiReq := &TrxApiRequest{
		Message: TrxRequestMessage{
			Request: TrxRequest{
				Detail: TrxDetail{
					TranType:   "User",
					TranAction: "Lookup",
				},
				UserInfo: &TrxUserInfo{
					UserName: username,
				},
			},
		},
	}

	body, err := json.Marshal(apiReq)
	if err != nil {
		return "", err
	}

	// get the port, if supplied.
	// this is needed for internal D.N.S.
	port := ""
	if app.Config.TrxAPI.Port != "" {
		port += ":" + app.Config.TrxAPI.Port
	}

	// Create the http post request
	r, err := http.NewRequest("POST", app.Config.TrxAPI.Host+port+"/json", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}
	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", "Basic "+basicAuth(app.Config.TrxAPI.AuthClient.Username, app.Config.TrxAPI.AuthClient.Password))

	// Create client and make request
	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return "", err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			app.Logger.Errorw(err.Error())
			return
		}
	}(res.Body)

	respBody := TrxApiResponse{}
	err = json.NewDecoder(res.Body).Decode(&respBody)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK || respBody.Message.Response.Result.ResponseCode != "00" {
		log.Println(respBody)
		return "", errors.New("user lookup failed with GUID - " + respBody.Message.Response.Reference.Guid)
	}
	app.Logger.Info("user lookup succeeded with Guid - " + respBody.Message.Response.Reference.Guid)

	return respBody.Message.Response.QueryResponse.UserInfo.Client, nil
}

func TrxLeadInsert(app *application.Application, request UserAccessRequest) error {
	apiReq := &TrxApiRequest{
		Message: TrxRequestMessage{
			Request: TrxRequest{
				Detail: TrxDetail{
					TranType:   "Lead",
					TranAction: "Insert",
				},
				Lead: &TrxLead{
					LeadState: "New",
				},
				ClientInfo: &TrxClientInfo{
					Dba:   request.DbaName,
					Phone: request.PhoneNumber,
					Email: request.CorporateEmailAddress,
				},
				Contact: &TrxContact{
					Role:         "Business",
					ContactOrder: "1",
					FirstName:    request.FirstName,
					LastName:     request.LastName,
				},
			},
		},
	}

	body, err := json.Marshal(apiReq)
	if err != nil {
		return err
	}

	// get the port, if supplied.
	// this is needed for internal D.N.S.
	port := ""
	if app.Config.TrxAPI.Port != "" {
		port += ":" + app.Config.TrxAPI.Port
	}

	// Create the http post request
	r, err := http.NewRequest("POST", app.Config.TrxAPI.Host+port+"/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", "Basic "+basicAuth(app.Config.TrxAPI.LeadClient.Username, app.Config.TrxAPI.LeadClient.Password))

	// Create client and make request
	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			app.Logger.Errorw(err.Error())
			return
		}
	}(res.Body)

	respBody := TrxApiResponse{}
	err = json.NewDecoder(res.Body).Decode(&respBody)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusOK || respBody.Message.Response.Result.ResponseCode != "00" {
		return errors.New("lead insert failed with Guid - " + respBody.Message.Response.Reference.Guid)
	}

	app.Logger.Info("lead insert succeeded with Guid - " + respBody.Message.Response.Reference.Guid)
	return nil
}
