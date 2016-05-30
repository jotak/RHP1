# RHP1

## Setup

* Download / install mongodb
* Create databases "rhp1" and "rhp1_test"
* Create unique indexes on "rhp1" and "rhp1_test": **db.users.createIndex({"user.username": 1}, {unique: true})**
* Download dataset and update it (?) to make the array of users as document root
* Import dataset: **mongoimport --db rhp1 --collection users --drop --jsonArray --file users.json**

## Run

* Compile with tsc (I use TypeScript plugin for Atom editor)
..* Alternatively you can just checkout the "javascript" branch, which includes generated JS (https://github.com/jotak/RHP1/tree/javascript)
* Run **node main.js**, connect on http://localhost:8080/ (example: http://localhost:8080/users/ )
* Run **npm test** to run tests

## Remarks

As stated in comments [here](https://github.com/jotak/RHP1/blob/master/rest-api/restServer.ts), data should be cleaned-up of clear passwords and so on.
