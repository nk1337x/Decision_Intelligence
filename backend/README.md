# DecisionAI Backend

Backend API for the Event Planning Decision Intelligence System.

## Features

- Event planning option evaluation
- Multi-criteria decision analysis
- Trade-off analysis
- Confidence scoring
- RESTful API

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Analyze Event Options
```
POST /api/event-planning/analyze
```

**Request Body:**
```json
{
  "eventDetails": {
    "eventType": "Wedding",
    "attendees": "500",
    "theme": "Modern"
  },
  "options": [
    {
      "id": 1,
      "name": "Option A",
      "venue": "Grand Hotel Ballroom",
      "layout": "Theater style",
      "decoration": "Elegant floral",
      "setup": "Professional team"
    }
  ],
  "constraints": {
    "budget": "High",
    "timeline": "2 months",
    "resources": "Team of 15",
    "space": "10000 sq ft"
  },
  "goals": "Maximize experience, minimize risk",
  "priorities": {
    "cost": 7,
    "time": 6,
    "quality": 9,
    "impact": 10,
    "risk": 8
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "options": [...],
    "recommendation": {...},
    "tradeoffs": [...],
    "confidence": 92
  }
}
```

## Project Structure

```
backend/
├── controllers/       # Request handlers
├── routes/           # API routes
├── services/         # Business logic
├── server.js         # Entry point
├── package.json
└── .env
```
