# MongoChatBot - Solar Products Assistant

A lightweight AI-powered chatbot backend system that accepts user queries about solar products, retrieves information from MongoDB, and uses Mistral AI for natural language understanding.

## Features

- Express.js backend with MongoDB integration
- Mistral AI for natural language processing
- Simple API endpoint for product queries
- Rate limiting for API protection
- No login or frontend required

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection setup
├── models/
│   └── Product.js         # MongoDB product schema
├── routes/
│   └── api.js             # API routes
├── scripts/
│   └── seedProducts.js    # Script to seed product data
├── services/
│   └── mistralService.js  # Mistral AI integration
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── server.js             # Main application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Mistral AI API key

### Installation

1. Clone the repository

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and Mistral API key

5. Seed the database with sample products
   ```
   node scripts/seedProducts.js
   ```

6. Start the server
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Ask Question

```
POST /api/ask
```

Request Body:
```json
{
  "question": "What solar panels do you have?"
}
```

Response:
```json
{
  "success": true,
  "question": "What solar panels do you have?",
  "answer": "हमारे पास कई प्रकार के सोलर पैनल उपलब्ध हैं...",
  "productsCount": 20
}
```

## Error Handling

The API returns appropriate error messages and status codes:

- 400: Bad Request (missing question)
- 404: Not Found (no products in database)
- 429: Too Many Requests (rate limit exceeded)
- 500: Server Error

## License

MIT