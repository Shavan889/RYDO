# Buber Backend API Documentation

## User Registration Endpoint

### Overview
The user registration endpoint allows new users to create an account by providing their basic information. The endpoint validates all required fields and returns an authentication token upon successful registration.

---

### Endpoint Details

**Method:** `POST`

**Route:** `/users/register`

**Description:** Registers a new user and returns an authentication token.

---

### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email)",
  "fullname": {
    "firstName": "string (required, minimum 3 characters)",
    "lastName": "string (optional, minimum 3 characters if provided)"
  },
  "password": "string (required, minimum 6 characters)"
}
```

### Field Validation Rules

| Field | Type | Requirements | Error Message |
|-------|------|--------------|---------------|
| `email` | String | Must be a valid email format | "Invalid Email" |
| `fullname.firstName` | String | Minimum 3 characters | "First name must be at least 3 character long" |
| `fullname.lastName` | String | Optional, minimum 3 characters | "Last name must be at least 3 character long" |
| `password` | String | Minimum 6 characters | "Password must be 6 character long" |

---

### Response Status Codes

#### 201 - Created
Successful registration. Returns user object and authentication token.

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

#### 400 - Bad Request
Validation failed. Returns array of validation errors.

**Response Body:**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 character long",
      "path": "fullname.firstName",
      "location": "body"
    }
  ]
}
```

---

### Example Requests

#### Successful Registration
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "password": "SecurePassword123"
  }'
```

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```
Response: 400 Bad Request - "All fields are required"

---

### Important Notes

- Passwords are hashed using bcrypt before storage
- Email addresses must be unique in the database
- The authentication token is a JWT token signed with the `JWT_SECRET` environment variable
- Password field is not returned in the response for security reasons

---

## User Login Endpoint

### Overview
The user login endpoint allows existing users to authenticate by providing their email and password. Upon successful authentication, the endpoint returns an authentication token.

---

### Endpoint Details

**Method:** `POST`

**Route:** `/users/login`

**Description:** Authenticates an existing user and returns an authentication token.

---

### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email)",
  "password": "string (required, minimum 6 characters)"
}
```

### Field Validation Rules

| Field | Type | Requirements | Error Message |
|-------|------|--------------|---------------|
| `email` | String | Must be a valid email format | "Invalid Email" |
| `password` | String | Minimum 6 characters | "Password must be more than 6 character" |

---

### Response Status Codes

#### 200 - OK
Successful authentication. Returns user object and authentication token.

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

#### 400 - Bad Request
Validation failed. Returns array of validation errors.

**Response Body:**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### 401 - Unauthorized
Authentication failed. Invalid email or password.

**Response Body:**
```json
{
  "message": "Invalid email or password"
}
```

---

### Example Requests

#### Successful Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

#### Invalid Credentials
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "WrongPassword"
  }'
```
Response: 401 Unauthorized - "Invalid email or password"

---

### Important Notes

- Passwords are compared using bcrypt for security
- The authentication token is a JWT token signed with the `JWT_SECRET` environment variable
- Password field is not returned in the response for security reasons
- Both email and password must be valid for successful authentication

---

## User Profile Endpoint

### Overview
The user profile endpoint retrieves the authenticated user's profile information. This endpoint requires authentication via a valid JWT token.

---

### Endpoint Details

**Method:** `GET`

**Route:** `/users/profile`

**Description:** Retrieves the authenticated user's profile information.

**Authentication:** Required (JWT token)

---

### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

---

### Response Status Codes

#### 200 - OK
Successfully retrieved user profile.

**Response Body:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john@example.com",
  "socketId": null,
  "__v": 0
}
```

#### 401 - Unauthorized
Authentication failed or token is missing/invalid.

**Response Body:**
```json
{
  "message": "Unauthorized"
}
```

---

### Example Requests

#### Successful Profile Retrieval
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Using Cookie
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Important Notes

- Authentication is required for this endpoint
- Token must be valid and not expired
- Token must not be blacklisted (logged out)
- Password field is not included in the response

---

## User Logout Endpoint

### Overview
The user logout endpoint invalidates the user's authentication token by adding it to a blacklist. This endpoint requires authentication via a valid JWT token.

---

### Endpoint Details

**Method:** `GET`

**Route:** `/users/logout`

**Description:** Logs out the authenticated user and invalidates their authentication token.

**Authentication:** Required (JWT token)

---

### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

---

### Response Status Codes

#### 200 - OK
Successfully logged out.

**Response Body:**
```json
{
  "message": "Logged Out"
}
```

#### 401 - Unauthorized
Authentication failed or token is missing/invalid.

**Response Body:**
```json
{
  "message": "Unauthorized"
}
```

---

### Example Requests

#### Successful Logout
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Using Cookie
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Important Notes

- Authentication is required for this endpoint
- The token is cleared from cookies after logout
- The token is added to a blacklist to prevent reuse
- Subsequent requests with the blacklisted token will be rejected
- Token must be valid at the time of logout

---

# Captain Endpoints

## Captain Registration Endpoint

### Overview
The captain registration endpoint allows new captains to create an account by providing their personal information and vehicle details. The endpoint validates all required fields and returns an authentication token upon successful registration.

---

### Endpoint Details

**Method:** `POST`

**Route:** `/captains/register`

**Description:** Registers a new captain and returns an authentication token.

---

### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email)",
  "fullname": {
    "firstname": "string (required, minimum 3 characters)",
    "lastname": "string (optional, minimum 3 characters if provided)"
  },
  "password": "string (required, minimum 6 characters)",
  "vehicle": {
    "color": "string (required, minimum 3 characters)",
    "plate": "string (required, minimum 3 characters)",
    "capacity": "integer (required, minimum 1)",
    "vehicleType": "string (required, minimum 3 characters)"
  }
}
```

### Field Validation Rules

| Field | Type | Requirements | Error Message |
|-------|------|--------------|---------------|
| `email` | String | Must be a valid email format | "Invalid Email" |
| `fullname.firstname` | String | Minimum 3 characters | "First name must be at least 3 character long" |
| `password` | String | Minimum 6 characters | "Password must be 6 character long" |
| `vehicle.color` | String | Minimum 3 characters | "Color must be at least 3 character long" |
| `vehicle.plate` | String | Minimum 3 characters | "Plate must be at least 3 character long" |
| `vehicle.capacity` | Integer | Minimum 1 | "Capacity must be at least 1" |
| `vehicle.vehicleType` | String | Minimum 3 characters | "Vehicle type must be at least 3 character long" |

---

### Response Status Codes

#### 201 - Created
Successful registration. Returns captain object and authentication token.

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "Sedan"
    },
    "socketId": null,
    "__v": 0
  }
}
```

#### 400 - Bad Request
Validation failed. Returns array of validation errors.

**Response Body:**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 character long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "12345",
      "msg": "Password must be 6 character long",
      "path": "password",
      "location": "body"
    },
    {
      "type": "field",
      "value": "AB",
      "msg": "Color must be at least 3 character long",
      "path": "vehicle.color",
      "location": "body"
    }
  ]
}
```

#### 409 - Conflict
Captain with the provided email already exists.

**Response Body:**
```json
{
  "message": "Captain already exists"
}
```

---

### Example Requests

#### Successful Registration
```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.captain@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "password": "SecurePassword123",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "Sedan"
    }
  }'
```

#### Missing Required Vehicle Information
```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.captain@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "password": "SecurePassword123",
    "vehicle": {
      "color": "Black",
      "plate": "AB"
    }
  }'
```
Response: 400 Bad Request - Validation errors for missing/invalid vehicle fields

#### Captain Already Exists
```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing.captain@example.com",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "password": "SecurePassword123",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ789",
      "capacity": 5,
      "vehicleType": "SUV"
    }
  }'
```
Response: 409 Conflict - "Captain already exists"

---

### Important Notes

- Passwords are hashed using bcrypt before storage
- Email addresses must be unique in the database
- The authentication token is a JWT token signed with the `JWT_SECRET` environment variable
- Password field is not returned in the response for security reasons
- All vehicle information is required for captain registration
- Vehicle capacity must be a positive integer (minimum 1)
- The captain role is distinct from the user role and has specific vehicle-related fields

---

## Captain Login Endpoint

### Overview
The captain login endpoint allows existing captains to authenticate by providing their email and password. Upon successful authentication, the endpoint returns an authentication token.

---

### Endpoint Details

**Method:** `POST`

**Route:** `/captains/login`

**Description:** Authenticates an existing captain and returns an authentication token.

---

### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email)",
  "password": "string (required, minimum 6 characters)"
}
```

### Field Validation Rules

| Field | Type | Requirements | Error Message |
|-------|------|--------------|---------------|
| `email` | String | Must be a valid email format | "Invalid Email" |
| `password` | String | Minimum 6 characters | "Password must be more than 6 character" |

---

### Response Status Codes

#### 200 - OK
Successful authentication. Returns captain object and authentication token.

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "Sedan"
    },
    "socketId": null,
    "__v": 0
  }
}
```

#### 400 - Bad Request
Validation failed or invalid credentials.

**Response Body:**
```json
{
  "message": "Invalid Email or Password"
}
```

---

### Example Requests

#### Successful Login
```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.captain@example.com",
    "password": "SecurePassword123"
  }'
```

#### Invalid Credentials
```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.captain@example.com",
    "password": "WrongPassword"
  }'
```
Response: 400 Bad Request - "Invalid Email or Password"

---

### Important Notes

- Passwords are compared using bcrypt for security
- The authentication token is a JWT token signed with the `JWT_SECRET` environment variable
- Password field is not returned in the response for security reasons
- Both email and password must be valid for successful authentication
- The token is set in a cookie with the key `token`

---

## Captain Profile Endpoint

### Overview
The captain profile endpoint retrieves the authenticated captain's profile information. This endpoint requires authentication via a valid JWT token.

---

### Endpoint Details

**Method:** `GET`

**Route:** `/captains/profile`

**Description:** Retrieves the authenticated captain's profile information.

**Authentication:** Required (JWT token)

---

### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

---

### Response Status Codes

#### 201 - Created
Successfully retrieved captain profile.

**Response Body:**
```json
{
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "Sedan"
    },
    "socketId": null,
    "__v": 0
  }
}
```

#### 401 - Unauthorized
Authentication failed or token is missing/invalid.

**Response Body:**
```json
{
  "message": "Unauthorized"
}
```

---

### Example Requests

#### Successful Profile Retrieval
```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Using Cookie
```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Important Notes

- Authentication is required for this endpoint
- Token must be valid and not expired
- Token must not be blacklisted (logged out)
- Password field is not included in the response
- Vehicle information is included in the response

---

## Captain Logout Endpoint

### Overview
The captain logout endpoint invalidates the captain's authentication token by adding it to a blacklist. This endpoint requires authentication via a valid JWT token.

---

### Endpoint Details

**Method:** `GET`

**Route:** `/captains/logout`

**Description:** Logs out the authenticated captain and invalidates their authentication token.

**Authentication:** Required (JWT token)

---

### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

---

### Response Status Codes

#### 200 - OK
Successfully logged out.

**Response Body:**
```json
{
  "message": "Logout Successfully"
}
```

#### 401 - Unauthorized
Authentication failed or token is missing/invalid.

**Response Body:**
```json
{
  "message": "Unauthorized"
}
```

---

### Example Requests

#### Successful Logout
```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Using Cookie
```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Important Notes

- Authentication is required for this endpoint
- The token is cleared from cookies after logout
- The token is added to a blacklist to prevent reuse
- Subsequent requests with the blacklisted token will be rejected
- Token must be valid at the time of logout

---

# Ride Endpoints

## Get Fare Endpoint

### Overview
The get fare endpoint calculates and returns fare estimates for all available vehicle types (moto, auto, car) based on the pickup location and destination. The fare calculation takes into account the distance and estimated travel time between the two locations. This endpoint requires authentication.

---

### Endpoint Details

**Method:** `GET`

**Route:** `/rides/get-fare`

**Description:** Calculates fare estimates for all vehicle types based on pickup and destination locations.

**Authentication:** Required (JWT token)

---

### Request Parameters

Query Parameters:

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|-----------|-------------|
| `pickup` | String | Yes | Minimum 3 characters | The pickup location address |
| `destination` | String | Yes | Minimum 3 characters | The destination location address |

---

### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

---

### Response Status Codes

#### 200 - OK
Successfully calculated fares for all vehicle types.

**Response Body:**
```json
{
  "moto": 45.5,
  "auto": 72.8,
  "car": 95.3
}
```

Where each value represents the estimated fare for that vehicle type in your local currency.

#### 400 - Bad Request
Validation failed. Invalid or missing query parameters.

**Response Body:**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "ab",
      "msg": "Invalid pickup",
      "path": "pickup",
      "location": "query"
    }
  ]
}
```

#### 401 - Unauthorized
Authentication failed or token is missing/invalid.

**Response Body:**
```json
{
  "message": "Unauthorized"
}
```

#### 500 - Internal Server Error
Server error during fare calculation.

**Response Body:**
```json
{
  "message": "Error message describing what went wrong"
}
```

---

### Fare Calculation Formula

The fare for each vehicle type is calculated using the following formula:

```
Fare = Base Fare + (Distance in KM × Per KM Rate) + (Duration in Minutes × Per Minute Rate)
```

**Pricing Structure:**

| Vehicle Type | Base Fare | Per KM Rate | Per Minute Rate |
|--------------|-----------|------------|-----------------|
| moto | ₹10 | ₹5 | ₹1 |
| auto | ₹18 | ₹8 | ₹1.6 |
| car | ₹25 | ₹12 | ₹2.2 |

---

### Example Requests

#### Successful Fare Calculation
```bash
curl -X GET "http://localhost:3000/rides/get-fare?pickup=123%20Main%20Street&destination=456%20Oak%20Avenue" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Using Query Parameters
```bash
curl -X GET "http://localhost:3000/rides/get-fare" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -G \
  -d "pickup=123 Main Street" \
  -d "destination=456 Oak Avenue"
```

#### Using Cookie Authentication
```bash
curl -X GET "http://localhost:3000/rides/get-fare?pickup=Downtown%20Station&destination=Airport%20Terminal" \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Invalid Pickup Address (Too Short)
```bash
curl -X GET "http://localhost:3000/rides/get-fare?pickup=ab&destination=456%20Oak%20Avenue" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
Response: 400 Bad Request - "Invalid pickup"

#### Missing Required Parameters
```bash
curl -X GET "http://localhost:3000/rides/get-fare?pickup=123%20Main%20Street" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
Response: 400 Bad Request - "Invalid destination"

---

### Important Notes

- Authentication is required for this endpoint
- Token must be valid and not expired
- Token must not be blacklisted (logged out)
- Both pickup and destination must be at least 3 characters long
- The endpoint uses Google Maps API to calculate actual distance and duration between locations
- Fares are calculated in real-time based on current routing data
- The endpoint returns fares for all three vehicle types regardless of which one the user intends to book
- Prices may vary based on real-time conditions (traffic, demand, etc.)
- Minimum fare applies based on vehicle type and distance calculation
- This endpoint does not create a ride; it only calculates fare estimates
- Use the calculated fares to display options to the user before they confirm a ride
