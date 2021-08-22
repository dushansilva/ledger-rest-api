# LEDGER API
This API is used to see the ledger information for a lease.

## Pre-requisites
    1. nodejs
    2. postman or curl for invoking the api

## Few Notes
1. Authentication is implemented in a basic way, invoke the /ledger/authenticate resource will instantly give a token. **This is not a best practice**. Strictly for demonstration purposes 

2. Start date and end date should be in ISO format, and response will also be in ISO format

3. API documentation can be found in the resources/api-definition.yaml file. The hosted version can be found [here](https://app.swaggerhub.com/apis/dushansilva95/ledger-api/1.0.0#/default/post_ledger_authenticate)

## Running the application
1. `npm install` will install the required packages
2. `npm run start-prod` will start the server in port 3000

## Invoking the API using postman
1. Import the postman environment found in `postman-data/ledger-env.postman_environment.json`
2. Import the postman collection found in `postman-data/ledger-rest-api.postman_collection.json`
3. Set the environment as ledger-env (imported environment)
4. Invoking the authenticate request will set the token automatically
5. Invoke the ledger api

## Invoking using curl
1. Token request

        curl --request POST 'http://localhost:3000/ledger/authenticate'

2. Using the token taken from token request and set it to the authorization header in the ledger api request

        curl --request GET 'http://localhost:3000/ledger/?start_date=2021-03-02T15:00:00.000Z&end_date=2021-04-20T17:00:00.000Z&frequency=FORTNIGHTLY&weekly_rent=500&time_zone=America/Los_Angeles' \
        --header 'Authorization: Bearer $TOKEN'

## Running tests
Unit tests can be found in `test/unit` and integration tests can be found in `test/integration`
1. `npm install` will install the packages, if you done this already you can skip this step
2. `npm test` will run the tests

