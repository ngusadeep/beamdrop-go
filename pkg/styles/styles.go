package styles

import "github.com/fatih/color"

var (
	InfoStyle    = color.New(color.FgHiGreen, color.Bold)
	WarningStyle = color.New(color.FgHiYellow, color.Bold)
	ErrorStyle   = color.New(color.FgHiRed, color.Bold)
	DebugStyle   = color.New(color.FgHiCyan, color.Bold)
	TitleStyle   = color.New(color.FgHiMagenta, color.Bold, color.Underline)
)