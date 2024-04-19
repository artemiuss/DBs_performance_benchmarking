package models

type UserAccessRequest struct {
	DbaName               string `json:"dbaName"`
	CorporateEmailAddress string `json:"corporateEmailAddress"`
	FirstName             string `json:"firstName"`
	LastName              string `json:"lastName"`
	PhoneNumber           string `json:"phoneNumber"`
}

type UserLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserLogonResponse struct {
	FirstName string          `json:"firstName"`
	LastName  string          `json:"lastName"`
	Email     string          `json:"email"`
	ApiCreds  UserTrxApiCreds `json:"apiCreds"`
}

type UserSessionDetails struct {
	FirstName     string
	LastName      string
	Email         string
	Authenticated bool
	ApiCreds      UserTrxApiCreds
}

type UserTrxApiCreds struct {
	Client string
	Source string
	Token  string
}
