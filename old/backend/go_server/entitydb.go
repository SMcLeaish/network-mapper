// entitydb.go

package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Individual struct {
	ID          uint
	Name        string
	Location    string
	PhoneNumber string
}

func (Individual) TableName() string {
	return "individual"
}

type EntityDB struct {
	Conn *gorm.DB
}

func NewEntityDB(dsn string) (*EntityDB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &EntityDB{
		Conn: db,
	}, nil
}

func (e *EntityDB) Close() error {
	sqlDB, err := e.Conn.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

func (e *EntityDB) GetIndividualInfoByName(name string) (map[string]interface{}, error) {
	var individual Individual
	result := e.Conn.First(&individual, "name = ?", name)
	if result.Error != nil {
		return nil, fmt.Errorf("Failed to retrieve individual info: %v", result.Error)
	}

	floats, err := parseFloatArray(individual.Location)
	if err != nil {
		return nil, fmt.Errorf("Failed to convert location: %v", err)
	}

	return map[string]interface{}{
		"ID":          individual.ID,
		"Name":        individual.Name,
		"Location":    floats,
		"PhoneNumber": individual.PhoneNumber,
	}, nil
}

func parseFloatArray(input string) ([]float64, error) {
	input = strings.Trim(input, "{}")
	parts := strings.Split(input, ",")

	var result []float64
	for _, p := range parts {
		f, err := strconv.ParseFloat(p, 64)
		if err != nil {
			return nil, errors.New("error parsing float array")
		}
		result = append(result, f)
	}
	return result, nil
}
