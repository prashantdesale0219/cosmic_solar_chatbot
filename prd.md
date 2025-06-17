## 🧾 Product Requirements Document (PRD)

**Project Name:** MongoChatBot – Product Info Assistant via MongoDB
**Prepared For:** Deepnex
**Date:** June 17, 2025

---

### 1. 🎯 Purpose

Develop a lightweight AI-powered chatbot backend system that:

* Accepts user queries about solar products
* Retrieves accurate information from a MongoDB collection
* Uses Mistral (local or API-based) for natural language understanding
* Works without login, frontend, or external vector DBs

---

### 2. 🧠 System Overview: How It Works

```text
[User Query via API] →
[Backend API Receives Input] →
Fetch product data from MongoDB
↓
Prepare prompt with question + product data
↓
Send to Mistral (Local/API)
↓
Receive Answer
↓
Return response to frontend consumer (web/mobile/etc)
```

✅ Backend-only flow focused on data-query and AI answer
✅ No Chroma, vector search, or frontend logic involved

---

### 3. ⚙️ Tech Stack

| Component | Technology                 |
| --------- | -------------------------- |
| Backend   | Node.js + Express          |
| Database  | MongoDB (Atlas or Local)   |
| AI Model  | Mistral API / Local Server |
| Hosting   | Railway / VPS / Localhost  |

---

### 4. 🔌 Backend Modules & Responsibilities

#### 4.1 MongoDB Schema

**Collection:** `products`
**Document Example:**

```json
{
  "_id": "prod123",
  "name": "Loom Solar Panel 440W",
  "type": "Monocrystalline",
  "watt": 440,
  "price": 10500,
  "stock": 18,
  "features": ["25 Year Warranty", "High Efficiency"]
}
```

* Admin can add/update data via MongoDB Compass or script
* All documents fetched on each query (no filter logic for now)

#### 4.2 `/ask` API Endpoint

* `POST /ask`
* Accepts body: `{ question: "..." }`
* Loads all `products` from MongoDB
* Generates Mistral prompt:

```text
User Question: "{user_input}"

Available Products:
1. {product_1_summary}
2. {product_2_summary}
...

Answer only based on the above product data in friendly Hindi.
```

* Sends prompt to Mistral
* Returns LLM response in JSON

#### 4.3 Mistral Integration

* Local or API-hosted Mistral model
* Request via fetch/axios with headers & payload
* `.env` contains Mistral API URL & Key
* Instruction inside prompt ensures product-bound answers

---

### 5. 🔐 Access & Security

* No user auth/login required
* No frontend logic
* Backend protected by rate limiter (optional)
* Sensitive keys (Mistral API) stored in `.env`

---

### 6. ✅ Success Criteria

| Metric         | Goal                                   |
| -------------- | -------------------------------------- |
| Query Accuracy | 95% answers based on product DB        |
| Response Time  | < 2 seconds average                    |
| Simplicity     | Minimal moving parts, easy maintenance |
| Infrastructure | Fully backend-driven                   |

---

### 7. 🚀 Implementation Plan

#### 🗂️ MongoDB

* [x] Create DB `solar-ai`
* [x] Collection `products`
* [x] Insert 20+ solar product entries with full metadata

#### 🔧 Backend (Node.js)

* [x] Setup Express app
* [x] Connect to MongoDB
* [x] Define `/ask` route
* [x] Read all products on request
* [x] Generate prompt for Mistral
* [x] Hit Mistral endpoint & return reply

---

### 8. 🔄 Future Enhancements (Optional)

* Add keyword filter logic in MongoDB query
* Add feedback scoring for responses
* Log query history in a separate collection
* Add fallback logic when no product matches

---

Let me know when you want the complete `/ask` route source code or environment setup instructions. I’ll generate that for you next.
