# Next.js + Prisma + Docker Development Stack

A professional full-stack development environment featuring Next.js, PostgreSQL, Prisma, and an Nginx API Gateway with advanced features.

## Architecture Overview

This project uses Docker Compose to orchestrate a multi-container environment optimized for production-like development.

- **Nginx Gateway**: Entry point (Port 80) providing Load Balancing, Caching, and Rate Limiting.
- **Application replicas**: Multiple Next.js instances running with Hot Module Replacement (HMR).
- **WebSocket Service**: Dedicated Fastify service for real-time communication.
- **PostgreSQL**: Persistent database storage.
- **Prisma Studio**: Database management UI (Port 5555).

## Key Features

### 1. Nginx API Gateway

- **Load Balancing**: Uses the **Least Connections** algorithm to distribute traffic efficiently across application instances.
- **Micro-caching**: Caches `/api` responses for 60 minutes to reduce backend load.
- **Rate Limiting**: Protects against abuse with a limit of 10 requests per second per IP (burst allowed).

### 2. Optimized Development Experience

- **Hot-Reloading**: Code changes on the host machine are instantly reflected in the running container.
- **Multi-Stage Builds**: Dockerfile is optimized for both development (HMR) and production (standalone output).
- **Configurable Scaling**: Scale your application instances directly via the `.env` file.

## Getting Started

### Prerequisites

- Docker & Docker Compose

### 1. Setup Environment

Create or update your `.env` file based on the template:

```dotenv
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=db_name

# Local connection string (for running Next.js on host)
DATABASE_URL=postgresql://username:password@localhost:5432/db_name?schema=public

# Docker connection string (for internal container communication)
DOCKER_DATABASE_URL=postgresql://username:password@db:5432/db_name?schema=public

# Development scaling
APP_REPLICAS=3
```

### 2. Launch Development Environment

Run the following command to start all services:

```bash
docker-compose up --build
```

### 3. Access Your Services

- **Main Application**: [http://localhost](http://localhost) (via Nginx)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555)
- **Database**: `localhost:5432`

## Advanced Operations

### Scaling the Application

Change the `APP_REPLICAS` value in `.env` and run `docker-compose up`. Nginx will automatically pick up the new instances and start load-balancing traffic to them.

### Verifying Gateway Features

- **Load Balancing**: Check the `X-Upstream` header in the response via browser tools or `curl`.
- **Caching**: Check the `X-Cache-Status` header (HIT/MISS).

### Restarting & Monitoring Services

To restart services without rebuilding images:

```bash
# Restart Nginx
docker compose restart nginx

# Restart App (Next.js)
docker compose restart app

# Recreate container to pick up .env/yml changes (no rebuild)
docker compose up -d --no-deps <service-name>
```

To view service logs:

```bash
# View logs for a specific service (e.g., studio)
docker compose logs <service-name>

# View and follow logs
docker compose logs -f <service-name>
```

### Database Operations (Prisma)

To generate the Prisma client or push schema changes to the database:

```bash
# Generate Prisma client
docker compose exec app npx prisma generate

# Sync schema with database
docker compose exec app npx prisma db push

### Database Seeding

To populate the database with 100 dummy users, profiles, and associated posts:

```bash
# Optional: Ensure dependencies are installed in the container
docker compose exec app npm install @faker-js/faker @types/pg

# Run the seeding script
docker compose exec app npx prisma db seed
```
```

### Troubleshooting & Cleanup

If you change the database volume structure or encounter version errors:

```bash
# Full reset including volumes
docker-compose down -v
```

---

## 🛠 Deep Dive: Docker & Nginx Architecture

This section explains the technical implementation of our containerized environment and the Nginx gateway features.

### 🐳 Docker Implementation

We use a **Multi-Stage Dockerfile** and **Docker Compose** to balance development speed with production-readiness.

#### 1. Multi-Stage Dockerfile

Our [Dockerfile](file:///Users/d3vil/Documents/projects/prisma/Dockerfile) is divided into functional stages:

- **`deps`**: Installs OS-level dependencies and `pnpm` packages. Shared by all subsequent stages to avoid redundant installs.
- **`development`**:
  - Enables `corepack` for `pnpm`.
  - Runs `prisma generate`.
  - **Command**: `pnpm dev`.
  - **Goal**: Used during active development for Hot Module Replacement (HMR).
- **`builder`**: Builds the production Next.js application.
- **`runner`**: A minimal runtime image that only contains the production build (`.next/standalone`), ensuring the smallest possible image size.

#### 2. Volume Management Strategy

In [docker-compose.yml](file:///Users/d3vil/Documents/projects/prisma/docker-compose.yml), we use a specific volume strategy for development:

- **`.:/app`**: Binds your local source code to the container. This allows the Next.js dev server inside the container to see your host changes immediately.
- **`/app/node_modules` (Anonymous)**: Prevents your local `node_modules` from being overwritten by the container's version. This is critical because some packages are platform-specific (Linux vs. macOS).
- **`/app/.next` (Anonymous)**: Isolates build artifacts to prevent conflicts between your host and the container.

#### 3. Environment Variables

- **Interpolation**: Docker Compose reads your `.env` file and replaces strings like `${POSTGRES_USER}` with actual values before starting services.
- **Networking**: We use `db:5432` instead of `localhost:5432` inside containers because `db` resolves to the Postgres container's IP within the Docker internal network.

### 🚀 Nginx API Gateway

Nginx acts as a "Reverse Proxy" and "API Gateway," serving as the only public entry point to the system.

#### 1. Load Balancing Algorithms

Nginx supports several algorithms to distribute traffic. We have configured **Least Connections**, but others are available:

- **Least Connections (`least_conn`)**: (Current Config) Nginx tracks active requests and sends new traffic to the instance with the fewest connections. Ideal for requests that vary in processing time.
- **Round Robin (Default)**: Requests are distributed sequentially across the list of servers. Best when all servers have similar specifications and requests are uniform.
- **IP Hash (`ip_hash`)**: Uses a hash of the client's IP address to determine the server. This ensures "sticky sessions," where a client consistently hits the same server instance.

Current config in [nginx.conf](file:///Users/d3vil/Documents/projects/prisma/nginx/nginx.conf):

```nginx
upstream app_servers {
    least_conn;
    server app:3000;
}
```

- **How it works**: When you run multiple instances (e.g., via `APP_REPLICAS=3`), Docker's internal DNS returns multiple IPs for the name `app`.
- **Why Least Conn?**: It prevents any single container from being overwhelmed while others are idle, especially useful in development where some requests (like Prisma migrations) might take longer than others.

#### 2. Micro-Caching (`proxy_cache`)

```nginx
proxy_cache_path /var/cache/nginx ...;
...
proxy_cache my_cache;
proxy_cache_valid 200 60m;
```

- **How it works**: Nginx stores the response of successful GET requests in its own memory/disk cache.
- **Why use it**: For API results that don't change frequently, Nginx serves the response directly without hitting the Next.js app or the Database, reducing latency from ~100ms to <2ms.
- **`X-Cache-Status`**: We added this header so you can see if a request was a `HIT` (from cache) or `MISS` (from app).

#### 3. Rate Limiting (`limit_req`)

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

- **How it works**: Nginx tracks every unique IP address. If an IP sends more than 10 requests in a single second, Nginx will return a `503 Service Unavailable` or `429 Too Many Requests`.
- **Burst/Nodelay**: We allow a "burst" of extra requests to handle legitimate spikes (like a page loading many images) without immediate rejection, but overall traffic is smoothed to the target rate.

---

### 🛠 Summary of Service Flow

1.  **User** sends request to `localhost` (Port 80).
2.  **Nginx** receives the request.
    - Checks **Rate Limit**.
    - Checks **Cache** (for `/api` routes).
    - If no cache, uses **Least Conn** to pick an `app` container.
3.  **Next.js App** processes the request.
    - Connects to **Postgres** (via `db` hostname).
4.  **Nginx** returns the result to the user and stores it in cache if applicable.
