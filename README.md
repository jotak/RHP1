# RHP1

## Setup

* Download / install mongodb
* Create databases "rhp1" and "rhp1_test"
* Create unique indexes on "rhp1" and "rhp1_test": **db.users.createIndex({"user.username": 1}, {unique: true})**
* Download dataset and update it (?) to make the array of users as document root
* Import dataset: **mongoimport --db rhp1 --collection users --drop --jsonArray --file users.json**
