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

**Request**

`configuration (optional)` options based on the qrcode-svg configuration

```json
{
  "configuration": {
    "color": "#000000",
    "background": "#ffffff",
    ...
  }
}
```

**Response:**

```json
{
  "status": "success",
  "message": "QR code generated successfully",
  "data": {
    "svg": "<?xml .... ... "
  }
}
```

**Status Codes:**
`200 OK`

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
  "status": "success",
  "message": "Guest joined successfully",
  "data": {
    "event": "Tech Conference 2025",
    "guestId": "guestId123",
    "position": 1
  }
}
```

**Status Codes:**
`201 Created`, `400 Bad Request`, `403 Forbidden`

---

### `GET /guests/:guestId`

Returns full queue / guest information.

**Response:**

```json
{
  "status": "success",
  "message": "Guest found successfully",
  "data": {
    "_id": "guestId123",
    "event": "eventId123",
    "name": "Attendee Name",
    "served": false,
    "joinedAt": "2025-05-20T15:50:06.465Z"
  }
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `DELETE /guests/leave/:guestId`

Guest voluntarily leaves the queue/.

**Response:**

```json
{
  "status": "success",
  "message": "Guest left successfully",
  "data": {
    "guestId": "guestId123..",
    "name": "Attendee Name"
  }
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

### `POST /notifications/:eventId`

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
  "status": "success",
  "message": "Notification sent to attendees",
  "data": {
    "event": "eventId123",
    "message": "Event starts in 10 minutes!",
    "_id": "notificationId",
    "createdAt": "2025-05-21T05:21:03.335Z",
    "updatedAt": "2025-05-21T05:21:03.335Z"
  }
}
```

**Status Codes:**
`200 OK`, `404 Not Found`

---

### `GET /notifications/:eventId`

list all the notifications sent to eventId

**Response:**

```json
{
  "status": "success",
  "message": "Notification fetched successfully",
  "data": [
    {
      "event": "eventId123",
      "message": "Event starts in 10 minutes!",
      "_id": "notificationId",
      "createdAt": "2025-05-21T05:21:03.335Z",
      "updatedAt": "2025-05-21T05:21:03.335Z"
    }
  ]
}
```

**Status Codes:**
`200 OK`

---

### `PUT /notifications/:notificationId`

**Request**

```json
{
  "message": "Event starts in 20 minutes!"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Notification updated successfully",
  "data": [
    {
      "event": "eventId123",
      "message": "Event starts in 20 minutes!",
      "_id": "notificationId",
      "createdAt": "2025-05-21T05:21:03.335Z",
      "updatedAt": "2025-05-21T05:21:03.335Z"
    }
  ]
}
```

**Status Codes:**
`200 OK`, `404 Not Found`, `401 Unauthorized`

---

### `DELETE /notifications/:notificationId`

**Response:**

```json
{
  "status": "success",
  "message": "Notification deleted successfully",
  "data": [
    {
      "event": "eventId123",
      "message": "Event starts in 20 minutes!",
      "_id": "notificationId",
      "createdAt": "2025-05-21T05:21:03.335Z",
      "updatedAt": "2025-05-21T05:21:03.335Z"
    }
  ]
}
```

**Status Codes:**
`200 OK`, `404 Not Found`, `401 Unauthorized`

---

## 📊 `/analytics` – Insights & Stats

### `GET /analytics/event/:eventId`

Analytics for one event.

**Response:**

```json
{
  "_id": "682c4b92ddde587f0ef9396b",
  "name": "Tech Conference 2025",
  "description": "",
  "createdBy": "682c25c493c7a7b7e302acd7",
  "queues": [],
  "currentPosition": 0,
  "totalQueues": 100,
  "servedQueues": 80,
  "currentPosition": 0,
  "averageQueueTime": 720000, // in ms
  "createdAt": "2025-05-20T09:29:54.387Z",
  "updatedAt": "2025-05-21T04:18:57.814Z"
}
```

**Status Codes:**
`200 OK`, `401 Unauthorized`

---

### `GET /analytics/user/:userId`

All events analytics for an admin user.

**Response:**

```json
{
  "status": "success",
  "message": "Events analytics fetched successfully",
  "data": [
    {
      "_id": "eventId",
      "name": "Tech Conference 2025",
      "description": "",
      "createdBy": "userId",
      "queues": [],
      "currentPosition": 0,
      "createdAt": "2025-05-20T09:29:54.387Z",
      "updatedAt": "2025-05-21T04:18:57.814Z",
      "totalQueues": 2,
      "servedQueues": 0,
      "averageQueueTime": 0
    }
  ]
}
```

**Status Codes:**
`200 OK`, `401 Unauthorized`

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
│   ├── GET /:eventId
│   ├── POST /:eventId
│   ├── PUT /:notificationId
│   ├── DELETE /:notificationId
│
└── analytics/
    ├── GET /event/:eventId
    └── GET /user/:userId
```
