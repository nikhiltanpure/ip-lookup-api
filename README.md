# IP Prefix Lookup API (Node.js)

This project provides a **RESTful API** to check if a given IP address belongs to a known cloud provider's subnet. It uses **Node.js** for backend processing and supports **batch IP lookups** with efficient data storage and retrieval.

## Features
- Api lookup from `prefixes.json`
- Supports **single** and **batch IP lookup**
- Dockerized setup for easy deployment
- RESTful API following best practices

## Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/nikhiltanpure/ip-lookup-api.git
cd ip-prefix-lookup
```

### Install Dependencies
```sh
npm install
```

### Start the API
```sh
Create .env file at root level with below content
PORT=3000
```


### Start the API
```sh
node app.js
```

The API runs on **port 3000** by default.

---

## Swagger Url
```sh
http://localhost:3000/api-docs/
```

## Docker Setup

###  **Build & Run with Docker**
```sh
docker-compose up --build
```

###  **Stop Containers**
```sh
docker-compose down
```

---

##  API Endpoints

###  **Single IP Lookup**
```sh
GET /lookup/:ip
```
Example:
```sh
curl http://localhost:3000/lookup/184.51.33.230
```
Response:
```json
{
  "result": [
    { "subnet": "184.51.33.0/24", "provider": "Akamai", "tags": ["Cloud", "CDN/WAF"] }
  ]
}
```

###  **Batch IP Lookup**
```sh
POST /lookup
```
Example:
```sh
curl -X POST http://localhost:3000/lookup \
  -H "Content-Type: application/json" \
  -d '{"ips": ["184.51.33.230", "23.79.237.5"]}'
```

##  Error Handling
- **Invalid IP Address** → Returns `400 Bad Request`
- **Missing Parameters** → Returns `400 Bad Request`
- **Server Errors** → Returns `500 Internal Server Error`


##  Deployment
- Push Docker image to a registry:
```sh
docker tag ip-lookup-service your-dockerhub-username/ip-lookup-service
docker push your-dockerhub-username/ip-lookup-service
```
---

