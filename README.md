
# IP Prefix Lookup API (Node.js)

This project provides a **RESTful API** to check if a given IP address belongs to a known cloud provider's subnet. It uses **Node.js** for backend processing and supports **batch IP lookups** with efficient data storage and retrieval.

## Problem Statement
Assume there's a script that collects a list of IP subnets owned by all the public service providers. These IP subnets with their prefixes are provided in `prefixes.json` file. Each subnet has a Cloud Service Provider and some tag(s) attached to them. Each IP Subnet will consist of multiple IP addresses, based on the prefix. The biggest subnet we can have is /8 (16,777,216 IPs) and smallest subnet is /32 (1 IP).

As a user, we are going to provide either a single IP address or list of IP addresses via REST API. These IP(s) might or might not belong to the above IP subnets. Also these (IPs) could belong to multiple subnets. The expected output is name of the Cloud Service Provider and related tag(s), if matched for user input.

Example: The provided data contains “184.51.33.0/24” with “Akamai” as provider and “Cloud”, “CDN/WAF” as tags. So if user provides “184.51.33.230” as an input, the API should return something like `{“result”: [{“subnet”: “184.51.33.0/24”, “provider”: “Akamai”, “tags”: [“Cloud”, “CDN/WAF”]}]}` as output. As mentioned above, there could be multiple matching subnets.

Your task is to find a solution that's:
* The most efficient way to store this data. 
* The fast way to figure out if a user provided IP address belongs to a certain Cloud Provider Prefix or not?
* The ideal time for looking this up should be less than ~300ms for a batch of 10 IP addreses.
* Searching a single IP address should be less than ~50ms. (excluding N/W trip time)
* A single IP could belong to multiple subnets too.
* You can prepare/model the data as per your preference, if needed.
* Feel free to use any database for the task. Using a database is not mandatory.


Build RESTful endpoint(s) to search in Python (FastAPI):
 * Single IP address
 * Multiple IP addresses (batch)

Follow the RESTful design standards and coding standards. The code should be up to prod standards and follow best practices.


## Proposed Solution
### Algorithm Used
- Trie (Prefix Tree) Data Structure
- The solution utilizes a Trie (Prefix Tree) to store and search IP prefixes efficiently. The key benefits of using a Trie are:
- Efficient Storage: Overlapping subnets share common prefixes, reducing memory usage.
- Fast Lookup: IP addresses are parsed and checked against the Trie in O(log N) time.
- Optimized for CIDR Matching: The hierarchical nature of subnets aligns well with Trie traversal.

### Algorithm Description
Data Preparation: Load the prefixes.json file and insert each subnet into a Trie structure.

### Insert Operation:
- Convert the CIDR notation to a binary representation.
- Store each bit of the IP prefix in the Trie, ensuring minimal redundancy.

### Search Operation:
- Convert the given IP address into binary format.
- Traverse the Trie from the root node, following matching bits.
- Return all matching subnets, providers, and tags found along the path

## Limitations
- All test cases are not covered
- Scope to optimize speed and memory
- In-memory cache implemented for API rate limiting
- API authentication not implemented

## Features
- Api lookup from `prefixes.json`
- Supports **single** and **batch IP lookup**
- Dockerized setup for easy deployment
- RESTful API following best practices
- In Memory rate limiter implemented

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

### Environment Setup
```sh
Create .env file at root level with below content
PORT=3000
MAX_REQUEST_ALLOWED = 5
TIME_WINDOW_IN_SECONDS = 60
MAX_IP_SEARCH_LENGHT = 10
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

Response:
```json
{
  "results": {
    "147.161.140.0/23": [
      {
        "subnet": "147.161.140.0/23",
        "provider": "Zscaler",
        "tags": [
          "Cloud"
        ]
      }
    ],
    "128.177.125.0/24": [
      {
        "subnet": "128.177.125.0/24",
        "provider": "Zscaler",
        "tags": [
          "Cloud"
        ]
      }
    ],
    "136.226.232.0/23": [
      {
        "subnet": "136.226.232.0/23",
        "provider": "Zscaler",
        "tags": [
          "Cloud"
        ]
      }
    ],
    "147.161.178.0/23": [
      {
        "subnet": "147.161.178.0/23",
        "provider": "Zscaler",
        "tags": [
          "Cloud"
        ]
      }
    ]
  }
}
```

##  Error Handling
- **Invalid IP Address** → Returns `400 Bad Request`
- **Missing Parameters** → Returns `400 Bad Request`
- **Server Errors** → Returns `500 Internal Server Error`

### API Performance Metrics
| Query Type        | Average Response Time |
|------------------|----------------------|
| Single IP Lookup | ~10ms                 |
| Batch Lookup (10 IPs) | ~50ms           |
| Batch Lookup (50 IPs) | ~200ms           |


##  Deployment
- Push Docker image to a registry:
```sh
docker tag ip-lookup-service your-dockerhub-username/ip-lookup-service
docker push your-dockerhub-username/ip-lookup-service
```
---

