# 🚗 Vehicle Bookings API & Postman Collection Documentation

We have updated and verified the Postman Collection JSON file located at [`vehicle_bookings_postman_collection.json`](./vehicle_bookings_postman_collection.json) to cover all backend API routes. All routes have been fully tested against the live backend server, and their actual responses (status, headers, cookies, and body) are saved directly inside the collection file as examples.

This document describes how to import/use the Postman collection and provides a comprehensive reference of all endpoints along with saved response structures.

---

## 🚀 How to Use the Postman Collection

1. **Open Postman**.
2. Click **Import** in the top-left corner.
3. Select the file [`vehicle_bookings_postman_collection.json`](./vehicle_bookings_postman_collection.json) from the `backend/` directory of this repository.
4. Once imported, click on the **Vehicle Bookings API** folder.
5. Setup/verify the **Collection Variables**:
   - `BASE_URL`: Defaults to `http://localhost:5000/api/v1`
   - `TOKEN`: Session JWT token (automatically populated when you run the **Login User** request due to an embedded Postman test script!).

---

## 📡 API Reference

All endpoints below use the base URL:
```http
http://localhost:5000/api/v1
```

### 📚 Table of Contents

- [Health](#health)
  - [`GET` Check Server Health](#check-server-health)
- [Auth](#auth)
  - [`POST` Register User](#register-user)
  - [`POST` Login User](#login-user)
  - [`GET` Get Profile](#get-profile)
- [Bookings](#bookings)
  - [`POST` Create Booking](#create-booking)
  - [`GET` Get Bookings (Paginated, Sorted, Filtered)](#get-bookings-paginated-sorted-filtered)
  - [`GET` Fetch successful rides sorted by fare](#fetch-successful-rides-sorted-by-fare)
  - [`GET` Fetch paginated bike rides](#fetch-paginated-bike-rides)
  - [`GET` Fetch UPI rides sorted by distance](#fetch-upi-rides-sorted-by-distance)
  - [`GET` Fetch pickup location rides](#fetch-pickup-location-rides)
  - [`GET` Fetch drop rides sorted by ratings](#fetch-drop-rides-sorted-by-ratings)
  - [`GET` Fetch rides within fare range](#fetch-rides-within-fare-range)
  - [`GET` Fetch recent cancelled rides](#fetch-recent-cancelled-rides)
  - [`GET` Fetch Mini rides with cash payment](#fetch-mini-rides-with-cash-payment)
  - [`GET` Fetch highly rated driver rides](#fetch-highly-rated-driver-rides)
  - [`GET` Fetch long rides sorted by distance](#fetch-long-rides-sorted-by-distance)
  - [`GET` Get Single Booking by BookingId](#get-single-booking-by-bookingid)
  - [`PUT` Update Booking](#update-booking)
  - [`DELETE` Soft Delete Booking](#soft-delete-booking)
- [Analytics (Admin)](#analytics-admin)
  - [`GET` Get Revenue Stats](#get-revenue-stats)
  - [`GET` Get Status Distribution](#get-status-distribution)
  - [`GET` Get Location Demand](#get-location-demand)
  - [`GET` Get Ratings Summary](#get-ratings-summary)
- [Users (Admin Only)](#users-admin-only)
  - [`GET` Get All Users](#get-all-users)
  - [`POST` Create User](#create-user)
  - [`GET` Get User By ID](#get-user-by-id)
  - [`PUT` Update User](#update-user)
  - [`DELETE` Delete User](#delete-user)
- [Customers](#customers)
  - [`POST` Create Customer](#create-customer)
  - [`DELETE` Delete Customer](#delete-customer)
- [Drivers](#drivers)
  - [`POST` Create Driver](#create-driver)
  - [`DELETE` Delete Driver](#delete-driver)
- [Stats](#stats)
  - [`GET` Get Total Bookings](#get-total-bookings)
  - [`GET` Get Success Rides Count](#get-success-rides-count)
  - [`GET` Get Top Vehicle Type](#get-top-vehicle-type)
  - [`GET` Get Top Payment Method](#get-top-payment-method)
- [JWT & Options](#jwt-options)
  - [`POST` Generate JWT Token](#generate-jwt-token)
  - [`POST` Verify JWT Token](#verify-jwt-token)
- [Middleware & Rate Limiting](#middleware-rate-limiting)
  - [`GET` Admin Dashboard (Rate Limited)](#admin-dashboard-rate-limited)
  - [`GET` Protected Bookings list](#protected-bookings-list)

---

## Health

### Check Server Health

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/health
  ```
* **Authentication:** None (Public)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "API health status fetched successfully.",
    "data": {
      "status": "UP",
      "uptime": 12,
      "timestamp": "2026-06-17T18:00:09.281Z",
      "environment": "development",
      "database": "connected",
      "memoryUsage": {
        "rss": 95232000,
        "heapTotal": 59129856,
        "heapUsed": 30917536,
        "external": 21016596,
        "arrayBuffers": 18383031
      },
      "cpuUsage": {
        "user": 515000,
        "system": 406000
      }
    }
  }
  ```

---

## Auth

### Register User

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/auth/register
  ```
* **Authentication:** None (Public)

#### Request Body (JSON)
```json
{
  "name": "Test Admin",
  "email": "testadmin@booking.com",
  "password": "admin123",
  "role": "admin",
  "customerId": "CID_TEST_ADMIN"
}
```

#### Saved Responses / Examples

* **400 Bad Request** (Success Response)
  ```json
  {
    "success": false,
    "message": "A user with this email address already exists.",
    "error": null
  }
  ```

---

### Login User

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/auth/login
  ```
* **Authentication:** None (Public)

#### Request Body (JSON)
```json
{
  "email": "admin@booking.com",
  "password": "admin123"
}
```

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "data": {
      "user": {
        "id": "6a1d1ffa1516ae084d2353d4",
        "name": "Default Admin",
        "email": "admin@booking.com",
        "role": "admin",
        "customerId": "CID_ADMIN"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWQxZmZhMTUxNmFlMDg0ZDIzNTNkNCIsImlhdCI6MTc4MTcxOTIwOSwiZXhwIjoxNzgxODA1NjA5fQ.eiej78-Ea2qryNp17Wm0SDQAZuOVhog9qWmk-lfnR0k"
    }
  }
  ```

---

### Get Profile

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/auth/profile
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully.",
    "data": {
      "id": "6a1d1ffa1516ae084d2353d4",
      "name": "Default Admin",
      "email": "admin@booking.com",
      "role": "admin",
      "customerId": "CID_ADMIN",
      "createdAt": "2026-06-01T06:00:26.212Z",
      "updatedAt": "2026-06-01T06:00:26.212Z"
    }
  }
  ```

---

## Bookings

### Create Booking

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/bookings
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "bookingId": "CNR_NEW_TEST_9999",
  "date": "2026-05-20T18:00:00.000Z",
  "time": "18:00:00",
  "bookingStatus": "Success",
  "customerId": "CID802429",
  "vehicleType": "Mini",
  "pickupLocation": "Indiranagar",
  "dropLocation": "Whitefield",
  "vTat": 120,
  "cTat": 45,
  "bookingValue": 450,
  "paymentMethod": "UPI",
  "rideDistance": 15,
  "driverRating": 4.5,
  "customerRating": 4.8
}
```

#### Saved Responses / Examples

* **400 Bad Request** (Success Response)
  ```json
  {
    "success": false,
    "message": "Booking with ID CNR_SPAM_1781336140153_0.9692278852752353 already exists.",
    "error": null
  }
  ```

---

### Get Bookings (Paginated, Sorted, Filtered)

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?page=1&limit=10&sortBy=date:desc&status=Success&vehicleType=Mini&search=Indiranagar
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d230f09",
          "bookingId": "CNR6536563208",
          "date": "2024-07-30T17:41:00.000Z",
          "time": "23:11:00",
          "bookingStatus": "Success",
          "customerId": "CID527863",
          "vehicleType": "Mini",
          "pickupLocation": "Chamarajpet",
          "dropLocation": "Indiranagar",
          "vTat": 105,
          "cTat": 100,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 412,
          "paymentMethod": "Cash",
          "rideDistance": 22,
          "driverRating": 3.9,
          "customerRating": 3.4,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.129Z",
          "updatedAt": "2026-06-01T06:00:21.129Z"
        },
        {
          "_id": "6a1d1ff41516ae084d234dad",
          "bookingId": "CNR2056404756",
          "date": "2024-07-30T14:06:00.000Z",
          "time": "19:36:00",
          "bookingStatus": "Success",
          "customerId": "CID826893",
          "vehicleType": "Mini",
          "pickupLocation": "Indiranagar",
          "dropLocation": "Hulimavu",
          "vTat": 273,
          "cTat": 135,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 188,
          "paymentMethod": "Cash",
          "rideDistance": 10,
          "driverRating": 4.8,
          "customerRating": 3.2,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.534Z",
          "updatedAt": "2026-06-01T06:00:21.534Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 61,
        "totalPages": 7,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch successful rides sorted by fare

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?status=Success&page=1&limit=10&sort=-Booking_Value
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff41516ae084d235164",
          "bookingId": "CNR4371152749",
          "date": "2024-07-05T05:47:00.000Z",
          "time": "11:17:00",
          "bookingStatus": "Success",
          "customerId": "CID449284",
          "vehicleType": "Mini",
          "pickupLocation": "Cox Town",
          "dropLocation": "Bellandur",
          "vTat": 126,
          "cTat": 95,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 2999,
          "paymentMethod": "Cash",
          "rideDistance": 12,
          "driverRating": 3.2,
          "customerRating": 4.5,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.555Z",
          "updatedAt": "2026-06-01T06:00:21.555Z"
        },
        {
          "_id": "6a1d1ff31516ae084d231f20",
          "bookingId": "CNR6913681615",
          "date": "2024-07-30T11:27:00.000Z",
          "time": "16:57:00",
          "bookingStatus": "Success",
          "customerId": "CID159544",
          "vehicleType": "Prime Sedan",
          "pickupLocation": "KR Puram",
          "dropLocation": "Shantinagar",
          "vTat": 91,
          "cTat": 110,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 2998,
          "paymentMethod": "UPI",
          "rideDistance": 27,
          "driverRating": 3.6,
          "customerRating": 3,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.276Z",
          "updatedAt": "2026-06-01T06:00:21.276Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 11354,
        "totalPages": 1136,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch paginated bike rides

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?vehicle=Bike&page=2&limit=5
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff41516ae084d23453a",
          "bookingId": "CNR8287251584",
          "date": "2024-07-30T17:47:00.000Z",
          "time": "23:17:00",
          "bookingStatus": "Canceled by Driver",
          "customerId": "CID450967",
          "vehicleType": "Bike",
          "pickupLocation": "Sarjapur Road",
          "dropLocation": "Vijayanagar",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": "Personal & Car related issue",
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 318,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.502Z",
          "updatedAt": "2026-06-01T06:00:21.502Z"
        },
        {
          "_id": "6a1d1ff31516ae084d232f91",
          "bookingId": "CNR4147125358",
          "date": "2024-07-30T17:47:00.000Z",
          "time": "23:17:00",
          "bookingStatus": "Success",
          "customerId": "CID779532",
          "vehicleType": "Bike",
          "pickupLocation": "KR Puram",
          "dropLocation": "Kammanahalli",
          "vTat": 119,
          "cTat": 100,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 566,
          "paymentMethod": "UPI",
          "rideDistance": 22,
          "driverRating": 4.8,
          "customerRating": 3.7,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.367Z",
          "updatedAt": "2026-06-01T06:00:21.367Z"
        },
        "... [truncated 3 items]"
      ],
      "pagination": {
        "page": 2,
        "limit": 5,
        "total": 5337,
        "totalPages": 1068,
        "hasNextPage": true,
        "hasPrevPage": true
      }
    }
  }
  ```

---

### Fetch UPI rides sorted by distance

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?payment=UPI&sort=-Ride_Distance
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d230c86",
          "bookingId": "CNR7142279862",
          "date": "2024-07-13T23:55:00.000Z",
          "time": "05:25:00",
          "bookingStatus": "Success",
          "customerId": "CID378034",
          "vehicleType": "eBike",
          "pickupLocation": "Yeshwanthpur",
          "dropLocation": "JP Nagar",
          "vTat": 210,
          "cTat": 45,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 461,
          "paymentMethod": "UPI",
          "rideDistance": 49,
          "driverRating": 4.5,
          "customerRating": 3.1,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.100Z",
          "updatedAt": "2026-06-01T06:00:21.100Z"
        },
        {
          "_id": "6a1d1ff31516ae084d230f1d",
          "bookingId": "CNR1593407677",
          "date": "2024-07-19T21:31:00.000Z",
          "time": "03:01:00",
          "bookingStatus": "Success",
          "customerId": "CID142070",
          "vehicleType": "Mini",
          "pickupLocation": "Banashankari",
          "dropLocation": "Bellandur",
          "vTat": 210,
          "cTat": 145,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 318,
          "paymentMethod": "UPI",
          "rideDistance": 49,
          "driverRating": 4.7,
          "customerRating": 3.3,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.129Z",
          "updatedAt": "2026-06-01T06:00:21.129Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 4578,
        "totalPages": 458,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch pickup location rides

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?pickup=Indiranagar&page=1&limit=20
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff41516ae084d23383c",
          "bookingId": "CNR4323368801",
          "date": "2024-07-30T18:04:00.000Z",
          "time": "23:34:00",
          "bookingStatus": "Success",
          "customerId": "CID389746",
          "vehicleType": "Bike",
          "pickupLocation": "Indiranagar",
          "dropLocation": "Yelahanka",
          "vTat": 126,
          "cTat": 50,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 198,
          "paymentMethod": "Cash",
          "rideDistance": 30,
          "driverRating": 3.2,
          "customerRating": 4.9,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.411Z",
          "updatedAt": "2026-06-01T06:00:21.411Z"
        },
        {
          "_id": "6a1d1ff31516ae084d232105",
          "bookingId": "CNR2738676791",
          "date": "2024-07-30T17:26:00.000Z",
          "time": "22:56:00",
          "bookingStatus": "Success",
          "customerId": "CID436671",
          "vehicleType": "Prime Sedan",
          "pickupLocation": "Indiranagar",
          "dropLocation": "Kadugodi",
          "vTat": 63,
          "cTat": 140,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 115,
          "paymentMethod": "UPI",
          "rideDistance": 37,
          "driverRating": 4.3,
          "customerRating": 3.5,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.284Z",
          "updatedAt": "2026-06-01T06:00:21.284Z"
        },
        "... [truncated 18 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 372,
        "totalPages": 19,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch drop rides sorted by ratings

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?drop=Jayanagar&sort=Customer_Rating
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d230cba",
          "bookingId": "CNR8369601219",
          "date": "2024-07-21T01:24:00.000Z",
          "time": "06:54:00",
          "bookingStatus": "Canceled by Driver",
          "customerId": "CID581505",
          "vehicleType": "Prime SUV",
          "pickupLocation": "Richmond Town",
          "dropLocation": "Jayanagar",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": "Customer related issue",
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 1609,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.102Z",
          "updatedAt": "2026-06-01T06:00:21.102Z"
        },
        {
          "_id": "6a1d1ff31516ae084d230db7",
          "bookingId": "CNR6613464835",
          "date": "2024-07-10T13:20:00.000Z",
          "time": "18:50:00",
          "bookingStatus": "Canceled by Customer",
          "customerId": "CID489613",
          "vehicleType": "Mini",
          "pickupLocation": "Whitefield",
          "dropLocation": "Vijayanagar",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": "Change of plans",
          "canceledRidesByDriver": null,
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 173,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.111Z",
          "updatedAt": "2026-06-01T06:00:21.111Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 741,
        "totalPages": 75,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch rides within fare range

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?minFare=500&maxFare=2000
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff41516ae084d234c0a",
          "bookingId": "CNR8450622966",
          "date": "2024-07-30T18:25:00.000Z",
          "time": "23:55:00",
          "bookingStatus": "Canceled by Driver",
          "customerId": "CID962254",
          "vehicleType": "eBike",
          "pickupLocation": "MG Road",
          "dropLocation": "Tumkur Road",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": "Personal & Car related issue",
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 929,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.527Z",
          "updatedAt": "2026-06-01T06:00:21.527Z"
        },
        {
          "_id": "6a1d1ff31516ae084d231702",
          "bookingId": "CNR8727975392",
          "date": "2024-07-30T18:18:00.000Z",
          "time": "23:48:00",
          "bookingStatus": "Success",
          "customerId": "CID363419",
          "vehicleType": "Prime Sedan",
          "pickupLocation": "KR Puram",
          "dropLocation": "Rajajinagar",
          "vTat": 161,
          "cTat": 25,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 1901,
          "paymentMethod": "UPI",
          "rideDistance": 4,
          "driverRating": 4,
          "customerRating": 3.1,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.194Z",
          "updatedAt": "2026-06-01T06:00:21.194Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 4671,
        "totalPages": 468,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch recent cancelled rides

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?status=Canceled by Driver&sort=-Date
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff41516ae084d234c0a",
          "bookingId": "CNR8450622966",
          "date": "2024-07-30T18:25:00.000Z",
          "time": "23:55:00",
          "bookingStatus": "Canceled by Driver",
          "customerId": "CID962254",
          "vehicleType": "eBike",
          "pickupLocation": "MG Road",
          "dropLocation": "Tumkur Road",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": "Personal & Car related issue",
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 929,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.527Z",
          "updatedAt": "2026-06-01T06:00:21.527Z"
        },
        {
          "_id": "6a1d1ff31516ae084d231d48",
          "bookingId": "CNR7665881605",
          "date": "2024-07-30T18:17:00.000Z",
          "time": "23:47:00",
          "bookingStatus": "Canceled by Driver",
          "customerId": "CID829141",
          "vehicleType": "Mini",
          "pickupLocation": "Whitefield",
          "dropLocation": "Ulsoor",
          "vTat": null,
          "cTat": null,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": "Customer was coughing/sick",
          "incompleteRides": null,
          "incompleteRidesReason": null,
          "bookingValue": 185,
          "paymentMethod": null,
          "rideDistance": 0,
          "driverRating": null,
          "customerRating": null,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.255Z",
          "updatedAt": "2026-06-01T06:00:21.255Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 3280,
        "totalPages": 328,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch Mini rides with cash payment

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?vehicle=Mini&payment=Cash
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d230f09",
          "bookingId": "CNR6536563208",
          "date": "2024-07-30T17:41:00.000Z",
          "time": "23:11:00",
          "bookingStatus": "Success",
          "customerId": "CID527863",
          "vehicleType": "Mini",
          "pickupLocation": "Chamarajpet",
          "dropLocation": "Indiranagar",
          "vTat": 105,
          "cTat": 100,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 412,
          "paymentMethod": "Cash",
          "rideDistance": 22,
          "driverRating": 3.9,
          "customerRating": 3.4,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.129Z",
          "updatedAt": "2026-06-01T06:00:21.129Z"
        },
        {
          "_id": "6a1d1ff41516ae084d233f68",
          "bookingId": "CNR9148136007",
          "date": "2024-07-30T16:42:00.000Z",
          "time": "22:12:00",
          "bookingStatus": "Success",
          "customerId": "CID248080",
          "vehicleType": "Mini",
          "pickupLocation": "Yelahanka",
          "dropLocation": "Mysore Road",
          "vTat": 168,
          "cTat": 65,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 107,
          "paymentMethod": "Cash",
          "rideDistance": 35,
          "driverRating": 4.1,
          "customerRating": 4.3,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.478Z",
          "updatedAt": "2026-06-01T06:00:21.478Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 863,
        "totalPages": 87,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch highly rated driver rides

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?driverRating=4&page=1&limit=10
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d231702",
          "bookingId": "CNR8727975392",
          "date": "2024-07-30T18:18:00.000Z",
          "time": "23:48:00",
          "bookingStatus": "Success",
          "customerId": "CID363419",
          "vehicleType": "Prime Sedan",
          "pickupLocation": "KR Puram",
          "dropLocation": "Rajajinagar",
          "vTat": 161,
          "cTat": 25,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 1901,
          "paymentMethod": "UPI",
          "rideDistance": 4,
          "driverRating": 4,
          "customerRating": 3.1,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.194Z",
          "updatedAt": "2026-06-01T06:00:21.194Z"
        },
        {
          "_id": "6a1d1ff31516ae084d232b2d",
          "bookingId": "CNR2684198148",
          "date": "2024-07-30T17:01:00.000Z",
          "time": "22:31:00",
          "bookingStatus": "Success",
          "customerId": "CID548676",
          "vehicleType": "eBike",
          "pickupLocation": "Whitefield",
          "dropLocation": "Chamarajpet",
          "vTat": 168,
          "cTat": 50,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 272,
          "paymentMethod": "Cash",
          "rideDistance": 47,
          "driverRating": 4,
          "customerRating": 3.9,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.325Z",
          "updatedAt": "2026-06-01T06:00:21.325Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 555,
        "totalPages": 56,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Fetch long rides sorted by distance

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings?distanceAbove=20&sort=-Ride_Distance
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Bookings fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a1d1ff31516ae084d230c86",
          "bookingId": "CNR7142279862",
          "date": "2024-07-13T23:55:00.000Z",
          "time": "05:25:00",
          "bookingStatus": "Success",
          "customerId": "CID378034",
          "vehicleType": "eBike",
          "pickupLocation": "Yeshwanthpur",
          "dropLocation": "JP Nagar",
          "vTat": 210,
          "cTat": 45,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 461,
          "paymentMethod": "UPI",
          "rideDistance": 49,
          "driverRating": 4.5,
          "customerRating": 3.1,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.100Z",
          "updatedAt": "2026-06-01T06:00:21.100Z"
        },
        {
          "_id": "6a1d1ff31516ae084d230c69",
          "bookingId": "CNR3612067560",
          "date": "2024-07-23T04:21:00.000Z",
          "time": "09:51:00",
          "bookingStatus": "Success",
          "customerId": "CID476071",
          "vehicleType": "Bike",
          "pickupLocation": "Tumkur Road",
          "dropLocation": "Whitefield",
          "vTat": 133,
          "cTat": 40,
          "canceledRidesByCustomer": null,
          "canceledRidesByDriver": null,
          "incompleteRides": "No",
          "incompleteRidesReason": null,
          "bookingValue": 140,
          "paymentMethod": "Cash",
          "rideDistance": 49,
          "driverRating": 3.2,
          "customerRating": 4.5,
          "vehicleImage": null,
          "isDeleted": false,
          "__v": 0,
          "createdAt": "2026-06-01T06:00:21.097Z",
          "updatedAt": "2026-06-01T06:00:21.097Z"
        },
        "... [truncated 8 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5743,
        "totalPages": 575,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Get Single Booking by BookingId

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/bookings/CNR2940424040
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Booking fetched successfully.",
    "data": {
      "_id": "6a1d1ff31516ae084d230c64",
      "bookingId": "CNR2940424040",
      "date": "2024-07-25T16:50:00.000Z",
      "time": "22:20:00",
      "bookingStatus": "Success",
      "customerId": "CID225428",
      "vehicleType": "Bike",
      "pickupLocation": "Magadi Road",
      "dropLocation": "Varthur",
      "vTat": 203,
      "cTat": 30,
      "canceledRidesByCustomer": null,
      "canceledRidesByDriver": null,
      "incompleteRides": "No",
      "incompleteRidesReason": null,
      "bookingValue": 158,
      "paymentMethod": "Cash",
      "rideDistance": 13,
      "driverRating": 4.1,
      "customerRating": 4,
      "vehicleImage": null,
      "isDeleted": false,
      "__v": 0,
      "createdAt": "2026-06-01T06:00:21.096Z",
      "updatedAt": "2026-06-01T06:00:21.096Z"
    }
  }
  ```

---

### Update Booking

* **HTTP Request:**
  ```http
  PUT http://localhost:5000/api/v1/bookings/CNR_NEW_TEST_9999
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "bookingStatus": "Success",
  "bookingValue": 500,
  "paymentMethod": "Credit Card",
  "customerRating": 5
}
```

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Booking updated successfully.",
    "data": {
      "_id": "6a2d084c0e8776654676da86",
      "bookingId": "CNR_SPAM_1781336140153_0.9692278852752353",
      "date": "2026-06-13T07:35:40.194Z",
      "time": "00:00:00",
      "bookingStatus": "Success",
      "customerId": "CID_USER",
      "vehicleType": "Mini",
      "pickupLocation": "A",
      "dropLocation": "B",
      "vTat": null,
      "cTat": null,
      "canceledRidesByCustomer": null,
      "canceledRidesByDriver": null,
      "incompleteRides": null,
      "incompleteRidesReason": null,
      "bookingValue": 500,
      "paymentMethod": "Credit Card",
      "rideDistance": 5,
      "driverRating": null,
      "customerRating": 5,
      "vehicleImage": null,
      "isDeleted": false,
      "createdAt": "2026-06-13T07:35:40.194Z",
      "updatedAt": "2026-06-17T18:00:12.316Z",
      "__v": 0
    }
  }
  ```

---

### Soft Delete Booking

* **HTTP Request:**
  ```http
  DELETE http://localhost:5000/api/v1/bookings/CNR_NEW_TEST_9999
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Booking CNR_SPAM_1781336140153_0.9692278852752353 deleted successfully.",
    "data": null
  }
  ```

---

## Analytics (Admin)

### Get Revenue Stats

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/analytics/revenue
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Revenue and distance statistics by vehicle type retrieved.",
    "data": [
      {
        "totalBookings": 2637,
        "vehicleType": "Prime Sedan",
        "totalRevenue": 1491750,
        "totalDistance": 40427,
        "averageRevenuePerBooking": 565.7
      },
      {
        "totalBookings": 2681,
        "vehicleType": "eBike",
        "totalRevenue": 1461662,
        "totalDistance": 42288,
        "averageRevenuePerBooking": 545.19
      },
      "... [truncated 5 items]"
    ]
  }
  ```

---

### Get Status Distribution

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/analytics/status-distribution
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Booking status distribution statistics retrieved.",
    "data": [
      {
        "count": 11353,
        "status": "Success"
      },
      {
        "count": 3280,
        "status": "Canceled by Driver"
      },
      "... [truncated 2 items]"
    ]
  }
  ```

---

### Get Location Demand

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/analytics/location-demand
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Top 10 pickup and drop locations retrieved successfully.",
    "data": {
      "topPickups": [
        {
          "count": 408,
          "location": "Kammanahalli"
        },
        {
          "count": 398,
          "location": "KR Puram"
        },
        "... [truncated 8 items]"
      ],
      "topDrops": [
        {
          "count": 400,
          "location": "HSR Layout"
        },
        {
          "count": 394,
          "location": "Majestic"
        },
        "... [truncated 8 items]"
      ]
    }
  }
  ```

---

### Get Ratings Summary

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/analytics/ratings-summary
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Average ratings summary by vehicle type retrieved.",
    "data": [
      {
        "ratedBookingsCount": 1636,
        "vehicleType": "Auto",
        "avgDriverRating": 3.99,
        "avgCustomerRating": 4
      },
      {
        "ratedBookingsCount": 1667,
        "vehicleType": "Bike",
        "avgDriverRating": 4,
        "avgCustomerRating": 3.98
      },
      "... [truncated 5 items]"
    ]
  }
  ```

---

## Users (Admin Only)

### Get All Users

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/users?page=1&limit=10
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Users fetched successfully.",
    "data": {
      "results": [
        {
          "_id": "6a32e02e00a32ddc4e8681a9",
          "name": "New User",
          "email": "newuser@booking.com",
          "role": "user",
          "customerId": null,
          "isDeleted": false,
          "resetPasswordToken": null,
          "resetPasswordExpire": null,
          "createdAt": "2026-06-17T17:58:06.606Z",
          "updatedAt": "2026-06-17T17:58:06.606Z",
          "__v": 0
        },
        {
          "_id": "6a32e02200a32ddc4e868191",
          "name": "Test Admin",
          "email": "testadmin@booking.com",
          "role": "admin",
          "customerId": "CID_TEST_ADMIN",
          "isDeleted": false,
          "resetPasswordToken": null,
          "resetPasswordExpire": null,
          "createdAt": "2026-06-17T17:57:54.357Z",
          "updatedAt": "2026-06-17T17:57:54.357Z",
          "__v": 0
        },
        "... [truncated 7 items]"
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 9,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### Create User

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/users
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "name": "New User",
  "email": "newuser@booking.com",
  "password": "user123",
  "role": "user"
}
```

#### Saved Responses / Examples

* **400 Bad Request** (Success Response)
  ```json
  {
    "success": false,
    "message": "Email already in use.",
    "error": null
  }
  ```

---

### Get User By ID

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/users/USER_ID
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "User fetched successfully.",
    "data": {
      "_id": "6a32e02e00a32ddc4e8681a9",
      "name": "New User",
      "email": "newuser@booking.com",
      "role": "user",
      "customerId": null,
      "isDeleted": false,
      "resetPasswordToken": null,
      "resetPasswordExpire": null,
      "createdAt": "2026-06-17T17:58:06.606Z",
      "updatedAt": "2026-06-17T17:58:06.606Z",
      "__v": 0
    }
  }
  ```

---

### Update User

* **HTTP Request:**
  ```http
  PUT http://localhost:5000/api/v1/users/USER_ID
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "name": "Updated User Name"
}
```

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "User updated successfully.",
    "data": {
      "id": "6a32e02e00a32ddc4e8681a9",
      "name": "Updated User Name",
      "email": "newuser@booking.com",
      "role": "user",
      "customerId": null
    }
  }
  ```

---

### Delete User

* **HTTP Request:**
  ```http
  DELETE http://localhost:5000/api/v1/users/USER_ID
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "User deleted successfully.",
    "data": null
  }
  ```

---

## Customers

### Create Customer

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/customers
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "customerId": "CID_NEW_99",
  "name": "John Doe"
}
```

#### Saved Responses / Examples

* **400 Bad Request** (Success Response)
  ```json
  {
    "success": false,
    "message": "Customer with ID CID_NEW_99 already exists.",
    "error": null
  }
  ```

---

### Delete Customer

* **HTTP Request:**
  ```http
  DELETE http://localhost:5000/api/v1/customers/CID_NEW_99
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **404 Not Found** (Success Response)
  ```json
  {
    "success": false,
    "message": "Customer with ID CID_NEW_99 not found.",
    "error": null
  }
  ```

---

## Drivers

### Create Driver

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/drivers
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Request Body (JSON)
```json
{
  "driverId": "DID_NEW_99",
  "name": "Driver Name"
}
```

#### Saved Responses / Examples

* **400 Bad Request** (Success Response)
  ```json
  {
    "success": false,
    "message": "Driver with ID DID_NEW_99 already exists.",
    "error": null
  }
  ```

---

### Delete Driver

* **HTTP Request:**
  ```http
  DELETE http://localhost:5000/api/v1/drivers/DID_NEW_99
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **404 Not Found** (Success Response)
  ```json
  {
    "success": false,
    "message": "Driver with ID DID_NEW_99 not found.",
    "error": null
  }
  ```

---

## Stats

### Get Total Bookings

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/stats/total-bookings
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Total bookings count fetched successfully.",
    "data": {
      "count": 18302
    }
  }
  ```

---

### Get Success Rides Count

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/stats/success-rides
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Successful rides count fetched successfully.",
    "data": {
      "count": 11353
    }
  }
  ```

---

### Get Top Vehicle Type

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/stats/top-vehicle
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Top vehicle type fetched successfully.",
    "data": {
      "vehicleType": "eBike",
      "count": 2681
    }
  }
  ```

---

### Get Top Payment Method

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/stats/top-payment-method
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Top payment method fetched successfully.",
    "data": {
      "paymentMethod": null,
      "count": 6962
    }
  }
  ```

---

## JWT & Options

### Generate JWT Token

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/jwt/generate-token
  ```
* **Authentication:** None (Public)

#### Request Body (JSON)
```json
{
  "email": "admin@booking.com",
  "password": "admin123"
}
```

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "JWT token generated successfully.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWQxZmZhMTUxNmFlMDg0ZDIzNTNkNCIsImlhdCI6MTc4MTcxOTIxNiwiZXhwIjoxNzgxODA1NjE2fQ.8Ddo-YAdaJ_Vg28hU7ntqhXiBf98WD_qqoWJfIp9Krk"
    }
  }
  ```

---

### Verify JWT Token

* **HTTP Request:**
  ```http
  POST http://localhost:5000/api/v1/jwt/verify-token
  ```
* **Authentication:** None (Public)

#### Request Body (JSON)
```json
{
  "token": "{{TOKEN}}"
}
```

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "JWT token is valid.",
    "data": {
      "decoded": {
        "id": "6a1d1ffa1516ae084d2353d4",
        "iat": 1781719209,
        "exp": 1781805609
      },
      "user": {
        "id": "6a1d1ffa1516ae084d2353d4",
        "name": "Default Admin",
        "email": "admin@booking.com",
        "role": "admin"
      }
    }
  }
  ```

---

## Middleware & Rate Limiting

### Admin Dashboard (Rate Limited)

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/admin/dashboard
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Admin: Dashboard stats accessed successfully.",
    "data": {
      "totalBookings": 18302,
      "successfulBookings": 11353,
      "cancelledBookings": 5142,
      "incompleteBookings": 0
    }
  }
  ```

---

### Protected Bookings list

* **HTTP Request:**
  ```http
  GET http://localhost:5000/api/v1/protected/bookings
  ```
* **Authentication:** Bearer Token (`Authorization: Bearer <TOKEN>`)

#### Saved Responses / Examples

* **200 OK** (Success Response)
  ```json
  {
    "success": true,
    "message": "Protected: Bookings accessed successfully.",
    "data": [
      {
        "_id": "6a1d1ff31516ae084d230c81",
        "bookingId": "CNR2998177390",
        "date": "2024-07-23T01:34:00.000Z",
        "time": "07:04:00",
        "bookingStatus": "Driver Not Found",
        "customerId": "CID946041",
        "vehicleType": "Auto",
        "pickupLocation": "RT Nagar",
        "dropLocation": "Yelahanka",
        "vTat": null,
        "cTat": null,
        "canceledRidesByCustomer": null,
        "canceledRidesByDriver": null,
        "incompleteRides": null,
        "incompleteRidesReason": null,
        "bookingValue": 802,
        "paymentMethod": null,
        "rideDistance": 0,
        "driverRating": null,
        "customerRating": null,
        "vehicleImage": null,
        "isDeleted": false,
        "__v": 0,
        "createdAt": "2026-06-01T06:00:21.100Z",
        "updatedAt": "2026-06-01T06:00:21.100Z"
      },
      {
        "_id": "6a1d1ff31516ae084d230c9d",
        "bookingId": "CNR7825941026",
        "date": "2024-07-17T19:07:00.000Z",
        "time": "00:37:00",
        "bookingStatus": "Success",
        "customerId": "CID234007",
        "vehicleType": "Mini",
        "pickupLocation": "Marathahalli",
        "dropLocation": "Langford Town",
        "vTat": 196,
        "cTat": 80,
        "canceledRidesByCustomer": null,
        "canceledRidesByDriver": null,
        "incompleteRides": "No",
        "incompleteRidesReason": null,
        "bookingValue": 316,
        "paymentMethod": "UPI",
        "rideDistance": 27,
        "driverRating": 3.1,
        "customerRating": 4.7,
        "vehicleImage": null,
        "isDeleted": false,
        "__v": 0,
        "createdAt": "2026-06-01T06:00:21.101Z",
        "updatedAt": "2026-06-01T06:00:21.101Z"
      },
      "... [truncated 18300 items]"
    ]
  }
  ```

---

