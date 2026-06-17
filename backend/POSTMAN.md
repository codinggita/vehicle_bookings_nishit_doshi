# Postman API Collection Documentation

We have updated the Postman Collection JSON file located at [vehicle_bookings_postman_collection.json](./vehicle_bookings_postman_collection.json) to cover all backend API routes. All routes have been fully tested against the live backend server, and their actual responses (status, headers, cookies, and body) are saved directly inside the collection file as examples.

This document describes how to use the collection and lists all the available backend endpoints.

---

## 🚀 How to Use the Postman Collection

1. **Open Postman**.
2. Click **Import** in the top left corner.
3. Select the file `vehicle_bookings_postman_collection.json` from the `backend/` directory of this repository.
4. Once imported, click on the **Vehicle Bookings API** folder.
5. Setup the Collection Variables:
   - `BASE_URL`: Defaults to `http://localhost:5000/api/v1`
   - `TOKEN`: Environment variable that is automatically populated upon calling the **Login User** request!

---

## 📡 API Endpoints Reference (with Saved Responses)

Here is a summary of the 40 routes documented and saved in the Postman collection:

### 1. Health & Version (Public)
* **`GET {{BASE_URL}}/health`**
  - Check the server and database status.
  - *Saved Response:* `200 OK` (contains uptime, memory usage, CPU usage, and database status).
* **`GET {{BASE_URL}}/version`**
  - Fetch application metadata and version status.
  - *Saved Response:* `200 OK` (contains package version and environment info).

### 2. Authentication
* **`POST {{BASE_URL}}/auth/register`**
  - Creates a new user profile.
  - Body: `{ "name", "email", "password", "role" (admin/user) }`
  - *Saved Response:* `400 Bad Request` (user already exists) / `201 Created` (success).
* **`POST {{BASE_URL}}/auth/login`**
  - Signs in a user and returns a JWT token.
  - Body: `{ "email", "password" }`
  - *Saved Response:* `200 OK` (returns JWT token and user info).
  - *Automated Postman script saves the returned token into the variable `{{TOKEN}}`.*
* **`GET {{BASE_URL}}/auth/profile`** (Bearer Auth)
  - Fetches the active profile details.
  - *Saved Response:* `200 OK` (returns details of the logged-in user).

### 3. Bookings (Bearer Auth)
* **`POST {{BASE_URL}}/bookings`**
  - Create a new ride booking.
  - Body: `{ "bookingId", "date", "vehicleType", "pickupLocation", "dropLocation", "bookingValue", "paymentMethod", "rideDistance", "driverRating", "customerRating" }`
  - *Saved Response:* `400 Bad Request` (validation errors) / `201 Created` (success).
* **`GET {{BASE_URL}}/bookings`**
  - Fetch all bookings with search, pagination, and sorting.
  - Query parameters: `page`, `limit`, `sortBy`, `status`, `vehicleType`, `search`
  - *Saved Response:* `200 OK` (contains paginated records of bookings).
* **`GET {{BASE_URL}}/bookings/:bookingId`**
  - Fetch details of a single booking.
  - *Saved Response:* `200 OK` (returns the booking object).
* **`PUT {{BASE_URL}}/bookings/:bookingId`**
  - Update booking status, ratings, or values.
  - *Saved Response:* `200 OK` (returns the updated booking object).
* **`DELETE {{BASE_URL}}/bookings/:bookingId`**
  - Soft deletes a booking.
  - *Saved Response:* `200 OK` (returns a success deletion message).

### 4. Users (Bearer Auth - Admin Only)
* **`GET {{BASE_URL}}/users`**
  - Fetch paginated list of all users.
  - *Saved Response:* `200 OK` (returns all user accounts).
* **`POST {{BASE_URL}}/users`**
  - Create a new user account.
  - *Saved Response:* `400 Bad Request` (validation error) / `201 Created` (success).
* **`GET {{BASE_URL}}/users/:id`**
  - Fetch user profile by database ID.
  - *Saved Response:* `200 OK` (returns user profile).
* **`PUT {{BASE_URL}}/users/:id`**
  - Update user name or email.
  - *Saved Response:* `200 OK` (returns updated user details).
* **`DELETE {{BASE_URL}}/users/:id`**
  - Delete a user.
  - *Saved Response:* `200 OK` (returns success status).

### 5. Customers & Drivers (Bearer Auth)
* **`POST {{BASE_URL}}/customers`** / **`POST {{BASE_URL}}/drivers`**
  - Create customer/driver records.
  - *Saved Responses:* Actual creation payloads and error handling outputs.
* **`DELETE {{BASE_URL}}/customers/:customerId`** / **`DELETE {{BASE_URL}}/drivers/:driverId`**
  - Delete customer/driver profiles.
  - *Saved Responses:* Actual deletion results or `404 Not Found` if records do not exist.

### 6. Stats & Analytics (Bearer Auth - Admin Only)
* **`GET {{BASE_URL}}/stats/total-bookings`**
  - Returns total bookings count.
  - *Saved Response:* `200 OK` (contains total count).
* **`GET {{BASE_URL}}/stats/top-vehicle`**
  - Returns most booked vehicle class.
  - *Saved Response:* `200 OK`.
* **`GET {{BASE_URL}}/stats/top-payment-method`**
  - Returns most used payment category.
  - *Saved Response:* `200 OK`.
* **`GET {{BASE_URL}}/analytics/revenue`**
  - Returns aggregated revenue stats by vehicle.
  - *Saved Response:* `200 OK`.
* **`GET {{BASE_URL}}/analytics/status-distribution`**
  - Returns status summary statistics.
  - *Saved Response:* `200 OK`.

### 7. JWT & Utilities
* **`POST {{BASE_URL}}/jwt/generate-token`**
  - Create raw JWT token.
  - *Saved Response:* `200 OK`.
* **`POST {{BASE_URL}}/jwt/verify-token`**
  - Verify if a token is valid.
  - *Saved Response:* `200 OK`.
* **`GET {{BASE_URL}}/admin/dashboard`** (Bearer Auth - Admin Only)
  - Rate-limited admin summary overview dashboard.
  - *Saved Response:* `200 OK`.
