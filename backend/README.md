# Endpoints

Here is the brief description of the API routes for this Queue Management Project. Please make sure to read it!

## 🔐 `/auth` – Authentication Routes

### `POST /auth/register`

**Description:** Registers a new admin.

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
  "message": "Registeration successful"
}
```

**Status Codes:**  
`201 Created`, `400 Bad Request`, `409 Conflict`

---

### `POST /auth/login`

**Description:** Logs in an admin.

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

## 🗓️ `/events` – Event Management

### `POST /events/create`

**Description:** Creates a new event.

**Request Body:**

```json
{
  "name": "Tech Conference 2025",
  "description": "Annual tech gathering",
  "capacity": 200,
  "adminId": "admin123"
}
```

**Response:**

```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "event123",
    "name": "Tech Conference 2025",
    "description": "Annual tech gathering",
    "capacity": 200,
    "adminId": "admin123"
  }
}
```

**Status Codes:**  
`201 Created`, `400 Bad Request`

---

### `GET /events/:eventId`

**Description:** Retrieves public event details.

**Response:**

```json
{
  "event": {
    "_id": "event123",
    "name": "Tech Conference 2025",
    "description": "Annual tech gathering",
    "capacity": 200
  }
}
```

**Status Codes:**  
`200 OK`, `404 Not Found`

---

### `GET /events/admin/:adminId`

**Description:** Lists all events created by an admin.

**Response:**

```json
{
  "events": [
    { "_id": "event123", "name": "Tech Conference", "capacity": 200 },
    { "_id": "event456", "name": "Workshop", "capacity": 100 }
  ]
}
```

**Status Codes:**  
`200 OK`

---

### `PUT /events/:eventId`

**Description:** Updates an existing event.

**Request Body:** _(Any updatable fields)_

```json
{
  "name": "Updated Conference",
  "capacity": 300
}
```

**Response:**

```json
{
  "message": "Event updated successfully",
  "event": { "_id": "event123", "name": "Updated Conference", "capacity": 300 }
}
```

**Status Codes:**  
`200 OK`, `404 Not Found`

---

### `DELETE /events/:eventId`

**Description:** Deletes an event.

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

**Description:** Generates a QR code that embeds the event ID.

**Response:**

```json
{
  "qrCodeUrl": "https://yourdomain.com/qrcodes/event123.png"
}
```

**Status Codes:**  
`200 OK`, `404 Not Found`

---

## 👤 `/guests` – Guest Queue Access (No Login)

### `POST /guests/join/:eventId`

**Description:** Guest joins the queue using event QR.

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
`201 Created`, `400 Bad Request`, `403 Event Full`

---

### `GET /guests/status/:guestId`

**Description:** Returns guest's full queue status.

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

**Description:** Guest's current queue number.

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

**Description:** Guest leaves the queue voluntarily.

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

**Description:** Returns full guest list for event queue.

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

**Description:** Admin reorders the queue manually.

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

**Description:** Marks a guest as served and moves queue.

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

**Description:** Admin removes a guest from the queue.

**Response:**

```json
{
  "message": "Guest removed"
}
```

**Status Codes:**  
`200 OK`, `404 Not Found`

---

## 🔔 `/notifications` – Manual Push Notices

### `POST /notifications/push/:eventId`

**Description:** Sends a manual message to all guests of an event.

**Request Body:**

```json
{
  "message": "The event will start in 10 minutes!"
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

## 📊 `/analytics` – Event Statistics

### `GET /analytics/event/:eventId`

**Description:** Analytics for a specific event.

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

### `GET /analytics/admin/:adminId`

**Description:** Combined analytics for all events by an admin.

**Response:**

```json
{
  "events": [
    {
      "eventId": "event123",
      "totalGuests": 100,
      "served": 90
    },
    {
      "eventId": "event456",
      "totalGuests": 50,
      "served": 45
    }
  ]
}
```

**Status Codes:**  
`200 OK`

---

## 🛠️ `/system` – Developer Utilities

### `GET /system/ping`

**Description:** Check if API is alive.

**Response:**

```json
{
  "status": "OK",
  "uptime": "2356 seconds"
}
```

---

### `GET /system/server-time`

**Description:** Get current server time.

**Response:**

```json
{
  "serverTime": "2025-04-04T18:00:00Z"
}
```

# Tree Strucute of the API

```tree structure

API
│
├── auth/
│ ├── POST /register → Admin register
│ ├── POST /login → Admin login
│ └── POST /logout → Admin logout
│
├── events/
│ ├── POST /create → Create new event
│ ├── GET /:eventId → Get event details (public)
│ ├── GET /admin/:adminId → Get all events by admin
│ ├── PUT /:eventId → Update event details
│ └── DELETE /:eventId → Delete an event
│
├── qr/
│ └── GET /generate/:eventId → Generate QR code for an event
│
├── guests/
│ ├── POST /join/:eventId → Guest joins queue via QR
│ ├── GET /status/:guestId → Get full queue status for guest
│ ├── GET /position/:guestId → Get current queue position
│ └── DELETE /leave/:guestId → Guest leaves the queue
│
├── queue/ (Admin-only)
│ ├── GET /event/:eventId → Admin gets full queue list
│ ├── PUT /move/:eventId → Admin moves guest in queue
│ ├── PUT /serve/:eventId → Admin marks guest as served
│ └── DELETE /remove/:guestId → Admin removes guest from queue
│
├── notifications/
│ └── POST /push/:eventId → Send live update to all guests
│
├── analytics/
│ ├── GET /event/:eventId → Analytics for a specific event
│ └── GET /admin/:adminId → All events analytics for admin
│
└── system/ (Optional Dev Tools)
├── GET /ping → API health check
└── GET /server-time → Get server time
```
