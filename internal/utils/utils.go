package utils

import (
	"os"
	"path/filepath"
)

func SaveToFile(folderPath, fileName string, data []byte) error {
	//file, err := os.Create(filepath.Join(folderPath, filepath.Base(fileName)))
	filePath := filepath.Join(folderPath, fileName)
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}
