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
	ConfigPath = filepath.Join(ConfigDir, "config.json")

	createConfigDir()

	if _, err := os.Stat(ConfigPath); os.IsNotExist(err) {
		createDefaultConfig()
	} else {
		loadExistingConfig()
	}
}

func createConfigDir() {
	if err := os.MkdirAll(ConfigDir, 0755); err != nil {
		log.Fatalf("failed to create config directory: %v", err)
	}
}

func createDefaultConfig() {
	// For now, we'll create an empty config file
	// In the future, you can serialize the config struct to JSON/YAML
	file, err := os.Create(ConfigPath)
	if err != nil {
		log.Fatalf("failed to create config file: %v", err)
	}
	defer file.Close()
	
	// Write a simple comment for now
	_, err = file.WriteString("# BeamDrop Configuration\n")
	if err != nil {
		log.Fatalf("failed to write to config file: %v", err)
	}
	
	log.Printf("Created default config file at: %s", ConfigPath)
}

func loadExistingConfig() {
	// For now, just log that we're loading the existing config
	// In the future, you can parse the config file and load settings
	log.Printf("Loading existing config from: %s", ConfigPath)
}

