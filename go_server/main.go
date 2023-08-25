package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
)

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

var db *EntityDB

func main() {
	// Fetch connection string from environment variable
	connStr := os.Getenv("DB_CONNECTION_STRING")
	if connStr == "" {
		log.Fatalf("DB_CONNECTION_STRING is not set in .env")
	}
	log.Println("DB Connection String:", connStr)
	
	var err error
	db, err = NewEntityDB(connStr)
	if err != nil {
		log.Fatalf("Failed to establish database connection: %v", err)
	}
	defer db.Close()

	http.HandleFunc("/individualInfo", getIndividualInfoByNameHandler)

	log.Println("Server started on :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getIndividualInfoByNameHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	name := queryParams.Get("name")
	if name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}

	individualInfo, err := db.GetIndividualInfoByName(name)
	if err != nil {
		log.Printf("Error fetching individual data: %v", err)
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(individualInfo)
}
