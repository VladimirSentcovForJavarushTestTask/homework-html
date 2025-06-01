# Homework repository

## Install dependencies

```npm install```

## Development Mode

```npm run dev```

## Build production

```npm run build```

## Docker Development

### Development Mode with Docker

```bash
# Start development server with hot reloading
docker compose up dev

# Rebuild and start development server
docker compose up --build dev
```

### Run test in docker

```bash
# Start development server with hot reloading
docker compose up test

# Rebuild and start development server
docker compose up --build test
```

### Production Build with Docker

```bash
# Build and start production server
docker compose up app

# Rebuild and start production server
docker compose up --build app
```

### Stop Docker Containers

```bash
# Stop all containers
docker compose down
```

The development server will be available at http://localhost:3000 with hot reloading enabled.
The production server will be available at http://localhost:8080.