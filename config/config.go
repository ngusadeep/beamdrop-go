package config

import (
	"log"
	"os"
	"path/filepath"
)

const (
	PORT          = 7777
	VERSION       = "0.0.1"
	ConfigDirName = ".beamdrop"
)

var (
	ConfigDir  string
	ConfigPath string
)

type Config struct {
	PORT int
}

type Flags struct {
	SharedDir string
	NoQR      bool
	Help      bool
}

func GetConfig() Config {
	return Config{
		PORT: PORT,
	}
}

func init() {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatalf("failed to get home directory: %v", err)
	}
	ConfigDir = filepath.Join(homeDir, ConfigDirName)
	ConfigPath = filepath.Join(ConfigDir, "beamdrop.db")

	createConfigDir()

	if _, err := os.Stat(ConfigPath); os.IsNotExist(err) {
		createConfigDb()
	} else {
		// For now, just log that we're loading the existing config
		log.Printf("Loading existing config from: %s", ConfigPath)
	}
}

func createConfigDir() {
	if err := os.MkdirAll(ConfigDir, 0755); err != nil {
		log.Fatalf("failed to create config directory: %v", err)
	}
}

func createConfigDb() {
	file, err := os.Create(ConfigPath)
	if err != nil {
		log.Fatalf("failed to create config file: %v", err)
	}
	defer file.Close()
	// TODO: Load initial settings
	log.Printf("Created default config file at: %s", ConfigPath)
}

