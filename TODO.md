## TODO:

- CHALLANGE REQUIREMENTS: allowing GETTING ALL USERS
    - "Adjust GET /users that it returns (all) users from the database." 
    -> Returning all users from a database is a bad practice
    -> Suggest adding a limit to the amount of requested users
    -> Suggest implementinga pagination system

- VALIDATORS: Extract validations to its own classes
    - Not needed as of now as the validations are really simple

- RESPONSE MODELS: Standarise reponse models
    - Cannot be done until new endpoints are requested

- SWAGGER: Evaluate adding swagger to share contract with consumers

- INTEGRATION TEST:
    - Add a test symulating the db being down (503?)