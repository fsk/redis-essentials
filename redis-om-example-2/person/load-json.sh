#!/bin/bash

# JSON dosyalarının bulunduğu dizin
DIRECTORY="/Users/fsk/Desktop/coding/redis-essentials/redis-om-example-2/person"

# DIRECTORY içindeki her JSON dosyası için döngü
for FILE in $DIRECTORY/*.json
do
  echo "Sending $FILE..."
  # Curl ile POST isteği yapılıyor
  curl -X POST -H "Content-Type: application/json" -d @$FILE http://localhost:1923/person
  echo "" # Yeni bir satır ekliyoruz
done

echo "All JSON files have been sent."