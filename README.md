# CRON Manager

CRON Manager is a full-stack project for managing CRON jobs via a REST API and front-end.
Jobs are persisted in a database and notify an external endpoint when triggered. Optional clustering support allows multiple API instances to safely run concurrently without double-firing jobs.

## Project Overview

The goal of this project is to provide a CRON management service that allows users to create, edit, delete, and list CRON jobs via a REST API. Each job defines:
- ```uri``` — the external endpoint to notify
- ```httpMethod``` — HTTP method (POST, GET, etc.)
- ```body``` — optional request payload
- ```schedule``` — CRON expression (Quartz format)
- ```timeZone``` — timezone (e.g., Europe/Lisbon)

When a job is triggered, the API notifies the configured endpoint. A Receiver service displays the received payload with timestamp in console or log file.

## Screenshots

### Jobs List
<img width="1918" height="914" alt="image" src="https://github.com/user-attachments/assets/37c2b922-6605-40bc-8128-27b7761896a2" />

### Create/Edit Form
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/f8d23b1e-d35f-45ef-b95e-d854bc59864f" />

## Architecture and Components

- **API & Scheduler**: ASP.NET Core 9 Minimal API + Quartz.NET
- **Receiver: Minima**l API that prints or logs received messages
- **Front-end**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Database**: PostgreSQL
- **Containers**: Docker + Docker Compose for local development and clustering

### Workflow

1. User creates a CRON job via API or front-end.
2. API schedules the job in Quartz.NET (cluster-aware).
3. When the job triggers, the API sends an HTTP request to the Receiver.
4. Receiver logs the message with timestamp:

```ruby
YYYY-MM-DD HH:mm:ss - BODY_CONTENT
```

## API Endpoints

| Method | Path                   | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | /api/crons             | Create a new job        |
| GET    | /api/crons             | List jobs               |
| GET    | /api/crons/{id}        | Job details             |
| PUT    | /api/crons/{id}        | Update job              |
| PATCH  | /api/crons/{id}/pause  | Pause job               |
| PATCH  | /api/crons/{id}/resume | Resume job              |
| DELETE | /api/crons/{id}        | Delete job              |
| POST   | /api/crons/{id}/run    | Trigger job immediately |

**Example Create Request (using Postman)**

```json
{
    "uri": "http://receiver:5000/notify",
    "httpMethod": "POST",
    "body": "{\"message\":\"Hello from Quartz\"}",
    "schedule": "0/10 * * * * ?", 
    "timeZone": "UTC"
}
```

## Setup and Running

### Prerequisites

- Docker
- Docker Compose

### Steps

#### Option 1: Using Docker Compose
Docker Compose runs all services **on a single host**.

**1. Clone the repository:**
```bash
git clone https://github.com/2mas1belino/cron-manager.git
cd cron-manager
```
**2. Build and start containers:**
```bash
docker compose up --build
```
- This will start the following services:
    - **db** - PostgreSQL database.
    - **api** - Backend Rest API and Quartz scheduler.
    - **receiver** - Minimal API for testing purposes that receives notification from the main API.

**3. Wait for ```api```,```receiver```, and ```db``` services to start.**

**4. Access front-end:**
```bash
cd web
npm install
npm run dev
```
- React app will run (usually at ```http://localhost:5173```) and communicate with ```http://localhost:5190``` API.

**5. Stopping and cleaning up:**
```bash
docker compose down -v
```

---
#### Option 2: Using Docker Stack
Docker Stack runs services in Swarm mode, allowing clustering, scaling, and fault tolerance. Use this if you want to test **multiple API instances safely running together**.

**1. Initialize Swarm (only needed once per machine):**
```bash
docker swarm init
```
**2. Build containers:**
```bash
docker compose build
```
**2. Deploy the stack:**
```bash
docker stack deploy -c docker-compose.yml cron-manager
```
- Swarm will start the same services as Compose, but respects the replicas setting in the compose file:
    - **api** — Runs with multiple replicas (e.g., 2 instances).
    - **db** — Single PostgreSQL instance.
    - **receiver** — Single instance.

**3. Check service status:**
```bash
docker stack services cron-manager
docker stack ps cron-manager
```

**4. Remove the stack when done:**
```bash
docker stack rm cron-manager
```
## Testing
1. **Create** a CRON job targeting the POST method on ```http://receiver:5000/notify``` and **make sure to use Quartz.NET format for schedule**.
2. Observe the **Receiver console** for messages:
```
2025-08-27 15:59:50 - {"message":"Hello"}
```
3. **Pause**, **resume**, **run immediately**, **edit** or **delete** jobs using API or front-end.
4. Optionally scale API instances to test clustering:
```bash
docker service scale cron-manager_api=3
```

If you want, you can import this collection in Postman to quickly test all API endpoints:

[Download CRON Manager Postman Collection](postman/CronManagerAPI.postman_collection.json)


## Author
This project was developed by Tomás Umbelino for a job application.
