# Raw API Documentation
* Version 1.0.5 uses Swagger 2.0
* Version 1.0.6 uses OpenAPI 3.0.0
* Both available in JSON and YAML

### [SwaggerHub 1.0.5](https://app.swaggerhub.com/apis/DENNISGORMAN02/ContactManager/1.0.5)
### [SwaggerHub 1.0.6](https://app.swaggerhub.com/apis/DENNISGORMAN02/ContactManager/1.0.6)

## More Details

### register.php
Resource:
* users

Requires:
* first name, last name
* username, password, confirmation password

### login.php
Resource:
* users

Requires:
  * username, password

### addContact.php
Resource:
* contacts

Requires:
* first name, last name
* email

### deleteContact.php
Resource:
* contacts

Requires:
* user ID number
* contact ID number
* contact information

### editContact.php
Resource:
* contacts

Requires:
* user ID number
* contact ID number
* contact information

### searchContact.php
Resource
* contacts

Requires
* user ID number

Extra Parameters
* contact ID number
  * grabs specific contact
* search query
  * matches all upper/lowercase substrings in first name, last name, and email
* page number
  * used for frontend pagination
