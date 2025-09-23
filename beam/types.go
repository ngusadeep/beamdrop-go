package beam

import "time"

type ServerStats struct{
	TotalRequests int
	TotalDownloads int
	CreatedAt time.Time
}