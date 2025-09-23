package beam

import "time"

type ServerStats struct{
	Downloads int       `json:"downloads"`
	Requests  int       `json:"requests"`
    Uploads   int       `json:"uploads"`
    StartTime time.Time `json:"startTime"`
}