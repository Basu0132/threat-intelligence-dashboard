 Threat Intelligence Dashboard
🔍 Overview
This project is a full stack web application called the Threat Intelligence Dashboard.
It allows a cybersecurity team to:

📊 Browse, filter, search and analyze cybersecurity threat data.

🧮 View summary statistics on threats.

🤖 Submit new threat descriptions to classify them using a trained ML model.

🔒 Secure access via JWT-based authentication.

It was developed as a take-home assessment to demonstrate full stack, ML, and secure app engineering skills.

💻 Technology Stack & Justification
Layer	Technology	Why chosen
Backend	Node.js + Express.js	Fast API development, async-friendly
Database	PostgreSQL	Reliable, relational, rich features
Frontend	React	Component-based SPA, very popular
ML	Python (Scikit-learn, pandas)	Industry standard for NLP & ML
Auth	JWT (via jsonwebtoken in Node)	Secure stateless authentication
Other	Docker (optional, see below)	Consistent local setup & deployment

🚀 Features Implemented
✅ Part 1: Core Application

📂 Data ingestion from CSV into PostgreSQL.

🚀 REST API to:

/api/threats with pagination, filtering by category, text search.

/api/threats/:id to view a single threat.

/api/threats/stats for summary counts.

🌐 React frontend with:

Dashboard for statistics.

Threats table with pagination, search, filter.

Detail view on click.

✅ Part 2: Advanced Features

🤖 Machine Learning classification:

Logistic Regression + TF-IDF on cleaned threat descriptions.

/api/threats/analyze endpoint to predict category.

🔒 JWT authentication:

/api/auth/login endpoint.

Protects /api/threats/analyze.

⚙️ Setup Instructions
1️⃣ Clone and install dependencies


git clone https://github.com/your-username/threat-dashboard.git
cd threat-dashboard
Backend



cd backend
npm install
Frontend



cd ../frontend
npm install
2️⃣ Configure environment variables
In backend/.env:

ini

DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
JWT_SECRET=supersecretkey
PORT=5000
3️⃣ Setup PostgreSQL
Create the database:

sql

CREATE DATABASE threatdb;
Run the schema:

sql

CREATE TABLE threats (
  id SERIAL PRIMARY KEY,
  threat_category VARCHAR(100),
  iocs TEXT,
  threat_actor TEXT,
  attack_vector TEXT,
  geographical_location TEXT,
  sentiment_in_forums TEXT,
  severity_score INT,
  predicted_threat_category TEXT,
  suggested_defense_mechanism TEXT,
  risk_level_prediction TEXT,
  cleaned_threat_description TEXT,
  keyword_extraction TEXT,
  named_entities TEXT,
  topic_modeling_labels TEXT,
  word_count INT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
4️⃣ Ingest data into database


cd backend
node ingest.js
5️⃣ Train the ML model


cd backend/ml
python train_model.py
This will create threat_model.pkl and tfidf_vectorizer.pkl in backend/ml.

6️⃣ Start servers
Start backend


cd backend
node server.js
Start frontend


cd frontend
npm start
The app runs on:

🌐 http://localhost:3000 (frontend)

🚀 http://localhost:5000 (backend API)

7️⃣ (Optional) Docker
If using Docker, you can start everything with:



docker-compose up
(You need to write a docker-compose.yml that wires up your frontend, backend, and a postgres container.)

8️⃣ Default credentials
Manually add a user for testing:

javascript

const bcrypt = require('bcryptjs')
console.log(bcrypt.hashSync('password123', 10))
Then insert into DB:

sql

INSERT INTO users (username, password_hash) VALUES ('admin', '<hash>');
Now login from Postman or frontend.


🚀 How to login & use secure routes
1. Login:

http

POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
⬇️ Returns

json

{ "token": "..." }


2. Classify a threat description:

http

POST /api/threats/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Suspicious traffic observed downloading ransomware payload"
}