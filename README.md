# CRON Manager

CRON Manager is a full-stack project for managing CRON jobs via a REST API and front-end.
Jobs are persisted in a database and notify an external endpoint when triggered. Optional clustering support allows multiple API instances to safely run concurrently without double-firing jobs.
---

## Project Overview

The goal of this project is to provide a CRON management service that allows users to create, edit, delete, and list CRON jobs via a REST API. Each job defines:
- uri — the external endpoint to notify
- httpMethod — HTTP method (POST, GET, etc.)
- body — optional request payload (Quartz format)
- schedule — CRON expression (5-field standard: m h dom mon dow)
- timeZone — IANA timezone (e.g., Europe/Lisbon)

When a job is triggered, the API notifies the configured endpoint. A Receiver service displays the received payload with timestamp in console or log file.
---

## Screenshots

### Jobs List

### Create/Edit Form

### Console Logs

---

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
---

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

**Example Create Request**

```json
{
    "uri": "http://receiver:5000/notify",
    "httpMethod": "POST",
    "body": "{\"message\":\"Hello from Quartz 2\"}",
    "schedule": "0/10 * * * * ?", 
    "timeZone": "UTC"
}
```
---

## Setup and Running

### Prerequisites

- Docker
- Docker Compose

### Steps
1. Clone the repository:
```bash
git clone https://github.com/2mas1belino/cron-manager.git
cd cron-manager
```
2. Build and start containers:
```bash
docker stack deploy -c docker-compose.yml cron-manager
```
3. Wait for ```api```,```receiver```, and ```db``` services to start.
4. Access front-end:
```bash
cd web
npm run dev
```
---

## Testing
1. Create a CRON job targeting the POST method on ```http://receiver:5000/notify```.
2. Observe the **Receiver console** for messages:
```
2025-08-27 15:59:50 - {"message":"Hello"}
```
3. Pause, resume, run immediately, edit or delete jobs using API or front-end.
4. Optionally scale API instances to test clustering:
```bash
docker service scale cron-manager_api=2
```
---

This project was developed by Tomás Umbelino
