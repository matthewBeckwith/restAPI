# restAPI
This is a RESTful API built in node.js and uses a     mongodb.


## Endpoints:
### Products = ``` localhost:3000/products/ ```
    GET         - Gets all products
    GET /:id    - Gets a specific product
    POST        - Creates a new Product (requires auth token)
    PATCH /:id  - Updates a specific product (requires auth token)
    DELETE /:id - Removes a specific product from database (requires auth token)

### Orders = ``` localhost:3000/orders/ ```
###### (all require the user to be authenticated with auth token)
    GET         - Gets all orders
    GET /:id    - Gets a specific order
    POST        - Creates a new order
    DELETE /:id - Removes a specific order from database

### User = ``` localhost:3000/users/ ```
    POST /signup    - Creates user
    POST /login     - Lets created user sign in and returns an auth token
    DELETE /:id     - Removes a user (requires auth token)
