# Endpoints - Queue Management System

A RESTful API for managing events, queues, and guest check-ins with admin control and analytics.

---

## 🔐 `/auth` – Authentication Routes

### `POST /auth/register`

Registers a new admin user.

**Request Body:**

```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Registration successful"
}
```

**Status Codes:**
`201 Created`, `400 Bad Request`, `409 Conflict`

---

### `POST /auth/login`

Logs in an admin.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "GENERATED_TOKEN"
  }
}
```

**Status Codes:**
`200 OK`, `401 Unauthorized`

---

### `GET /auth/me`

Fetches the current logged-in user's details using the provided token.

**Headers**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response**

```json
{
  "status": "success",
  "message": "User details fetched successfully",
  "data": {
    "_id": "user123",
    "username": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-05-20T12:00:00Z",
    "updatedAt": "2025-05-20T12:00:00Z"
  }
}
```

**Status Codes:**
`200 OK`, `401 Unauthorized`

---

### `PUT /auth/update`

Allows the logged-in user to update their profile information.

**Headers**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body**

```json
{
  "username": "New Username",
  "email": "newemail@example.com"
}
```

**Response**

```json
{
  "status": "success",
  "message": "User updated successfully",
  "user": {
    "_id": "user123",
    "username": "New Username",
    "email": "newemail@example.com"
  }
}
```

**Status Codes:**
`200 OK`, `400 Bad Request`, `401 Unauthorized`

---

## 🗓️ `/events` – Event Management

### `POST /events/create`

Creates a new event.

**Request Body:**

```json
{
  "name": "Tech Conference 2025",
  "description": "Annual tech gathering",
  "userId": "user123"
}
```

**Response:**

```json
{
  "message": "Event created successfully",
  "data": {
    "_id": "event123",
    "name": "Tech Conference 2025",
    "description": "Annual tech gathering",
    "createdBy": "user123"
  }
}
```

**Status Codes:**
`201 Created`, `400 Bad Request`

---

### `GET /events/:eventId`

Publicly retrieves event details.

**Response:**

```json
{
  "status": "success",
  "message": "Event fetched successfully",
  "data": {
    "_id": "eventId",
    "name": "Tech Conference 2025",
    "description": "Annual tech gathering",
    "createdBy": "userId123",
    "queues": [],
    "currentPosition": 0,
    "createdAt": "2025-05-20T08:40:05.745Z",
    "updatedAt": "2025-05-20T08:40:05.745Z"
  }
}
```

**Status Codes:**
`200 OK`, `404 Not Found`, `400 Bad Request`

---

### `GET /events`

Returns all events created by the logged-in user (admin).

**Response:**

```json
{
  "status": "success",
  "message": "Events fetched successfully",
  "data": [
    {
      "_id": "682c3fe534d38895b839c280",
      "name": "Tech Conference 2025",
      "description": "Annual tech gathering",
      "createdBy": "682c25c493c7a7b7e302acd7",
      "queues": [],
      "currentPosition": 0,
      "createdAt": "2025-05-20T08:40:05.745Z",
      "updatedAt": "2025-05-20T08:40:05.745Z"
    }
  ]
}
```

**Status Codes:**
`200 OK`, `400 Bad Request`

---

### `PUT /events/:eventId`

Updates an existing event.

**Request Body:**

```json
{
  "name": "Tech Conference 2025",
  "description": "Annual tech gathering.."
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Event updated successfully",
  "data": {
    "_id": "682c3fe534d38895b839c280",
    "name": "Tech Conference 2025",
    "description": "Annual tech gathering..",
    "currentPosition": 0
  }
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `DELETE /events/:eventId`

Deletes an event.

**Response:**

```json
{
  "message": "Event deleted successfully"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

## 📸 `/qr` – QR Code

### `GET /qr/generate/:eventId`

Generates a QR code linking to the event.

**Response:**

```json
{
  "qrCodeUrl": "https://yourdomain.com/qrcodes/event123.png"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

## 👤 `/guests` – Guest Queue (No Login)

### `POST /guests/join/:eventId`

Guest joins the event queue.

**Request Body:**

```json
{
  "name": "Jane Guest",
  "email": "jane@example.com"
}
```

**Response:**

```json
{
  "message": "Guest joined queue",
  "guestId": "guest123",
  "position": 5
}
```

**Status Codes:**
`201 Created`, `400 Bad Request`, `403 Forbidden`

---

### `GET /guests/status/:guestId`

Returns full queue status.

**Response:**

```json
{
  "guestId": "guest123",
  "eventId": "event123",
  "position": 5,
  "status": "waiting"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `GET /guests/position/:guestId`

Gets guest’s current position.

**Response:**

```json
{
  "position": 5,
  "status": "waiting"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `DELETE /guests/leave/:guestId`

Guest voluntarily leaves the queue.

**Response:**

```json
{
  "message": "Guest removed from queue"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

## 🧑‍💼 `/queue` – Admin Queue Management

### `GET /queue/event/:eventId`

Returns guest queue for a given event.

**Response:**

```json
{
  "queue": [
    { "guestId": "guest123", "name": "Jane", "position": 1 },
    { "guestId": "guest456", "name": "Bob", "position": 2 }
  ]
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `PUT /queue/move/:eventId`

Admin manually reorders queue.

**Request Body:**

```json
{
  "guestId": "guest123",
  "newPosition": 1
}
```

**Response:**

```json
{
  "message": "Guest moved in queue"
}
```

**Status Codes:**
`200 OK`, `400 Bad Request`

---

### `PUT /queue/serve/:eventId`

Marks guest as served and advances the queue.

**Request Body:**

```json
{
  "guestId": "guest123"
}
```

**Response:**

```json
{
  "message": "Guest marked as served"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `DELETE /queue/remove/:guestId`

Admin removes guest from queue.

**Response:**

```json
{
  "message": "Guest removed"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

## 🔔 `/notifications` – Manual Messages

### `POST /notifications/push/:eventId`

Sends a broadcast message to all guests.

**Request Body:**

```json
{
  "message": "Event starts in 10 minutes!"
}
```

**Response:**

```json
{
  "message": "Notification sent to guests"
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

## 📊 `/analytics` – Insights & Stats

### `GET /analytics/event/:eventId`

Analytics for one event.

**Response:**

```json
{
  "totalGuests": 100,
  "served": 80,
  "noShows": 5,
  "avgWaitTime": "12 minutes"
}
```

**Status Codes:**
`200 OK`

---

### `GET /analytics/user/:userId`

All events analytics for an admin user.

**Response:**

```json
{
  "events": [
    {
      "eventId": "event123",
      "totalGuests": 100,
      "served": 90
    }
  ]
}
```

**Status Codes:**
`200 OK`

---

## 🛠️ `/system` – Developer Utilities

### `GET /system/ping`

Checks if API is alive.

**Response:**

```json
{
  "status": "OK",
  "uptime": "2356 seconds"
}
```

---

### `GET /system/server-time`

Returns current server time.

**Response:**

```json
{
  "serverTime": "2025-04-04T18:00:00Z"
}
```

---

## 📁 API Route Structure

```
API
│
├── auth/
│   ├── POST /register
│   ├── POST /login
│   ├── GET /me
│   └── PUT /update
│
├── events/
│   ├── POST /create
│   ├── GET /:eventId
│   ├── GET /user/:userId
│   ├── PUT /:eventId
│   └── DELETE /:eventId
│
├── qr/
│   └── GET /generate/:eventId
│
├── guests/
│   ├── POST /join/:eventId
│   ├── GET /status/:guestId
│   ├── GET /position/:guestId
│   └── DELETE /leave/:guestId
│
├── queue/
│   ├── GET /event/:eventId
│   ├── PUT /move/:eventId
│   ├── PUT /serve/:eventId
│   └── DELETE /remove/:guestId
│
├── notifications/
│   └── POST /push/:eventId
│
├── analytics/
│   ├── GET /event/:eventId
│   └── GET /user/:userId
│
└── system/
    ├── GET /ping
    └── GET /server-time
```
