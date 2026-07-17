# Shopping Application 3-Tier

This project is a simple three-tier shopping application built with a frontend, a backend API, and a PostgreSQL database. It is designed to demonstrate a basic full-stack setup that can be run locally or with Docker Compose.

## Overview

The application allows users to view products, place orders, and interact with a backend service that stores data in PostgreSQL. The frontend is served by the Express backend, while the database layer handles product and order storage.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Containerization: Docker, Docker Compose

## Project Structure

- [frontend/index.html](frontend/index.html) - Main UI page
- [frontend/app.js](frontend/app.js) - Client-side logic
- [frontend/styles.css](frontend/styles.css) - Styling for the interface
- [backend/index.js](backend/index.js) - Express server and API routes
- [backend/db.js](backend/db.js) - PostgreSQL connection and database initialization
- [backend/package.json](backend/package.json) - Backend dependencies and scripts
- [backend/Dockerfile](backend/Dockerfile) - Backend container definition
- [docker-compose.yml](docker-compose.yml) - Multi-container setup for app and database

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- Docker and Docker Compose installed

## Running the Application

### Option 1: Run with Docker Compose

From the project root, run:

```powershell
docker compose up --build
```

Then open:

```text
http://localhost:3000
```

### Option 2: Run Locally

```powershell
cd backend
npm install   # because of its node.js application
node index.js
```

Then open:

```text
http://localhost:3000
```

## Database

The application uses PostgreSQL for persistent storage. The Docker Compose setup starts a PostgreSQL container automatically and configures the backend to connect to it.

## API Endpoints

- GET /api/products - Returns all products
- POST /api/orders - Creates a new order
- GET /api/health - Checks backend health

## ENTRYPOINT vs CMD in Docker

Both ENTRYPOINT and CMD are used in a Dockerfile to define what should run when a container starts, but they serve different purposes.

### 1. CMD

CMD sets the default command for the container.

- It is used when you want a default behavior.
- It can be easily overridden when you run the container.
- It is often used for the main program or script.

Example:

```dockerfile
CMD ["node", "app.js"]
```

If you run:

```powershell
docker run my-image
```

then the container runs:

```text
node app.js
```

If you run:

```powershell
docker run my-image python app.py
```

then the CMD is overridden and the container runs:

```text
python app.py
```

### 2. ENTRYPOINT

ENTRYPOINT defines the main executable of the container.

- It is usually used when the container should always run a specific command.
- Extra arguments passed at runtime are appended to it.
- It is more fixed than CMD.

Example:

```dockerfile
ENTRYPOINT ["node", "app.js"]
```

If you run:

```powershell
docker run my-image --port 3000
```

then the container runs:

```text
node app.js --port 3000
```

### 3. Difference between them

- CMD provides a default command that can be changed.
- ENTRYPOINT provides the main command that should stay fixed.
- If both are used together, ENTRYPOINT defines the base command and CMD provides default arguments.

Example:

```dockerfile
ENTRYPOINT ["node"]
CMD ["app.js"]
```

This means the container will run:

```text
node app.js
```

### 4. Passing runtime arguments

If you want to pass 5 runtime arguments, you can do this:

```powershell
docker run my-image arg1 arg2 arg3 arg4 arg5
```

If ENTRYPOINT is set like this:

```dockerfile
ENTRYPOINT ["node", "app.js"]
```

then the container receives those arguments and runs:

```text
node app.js arg1 arg2 arg3 arg4 arg5
```

### 5. Simple rule to remember

- Use ENTRYPOINT when the container must always run the same program.
- Use CMD when you want a default argument or command that can be changed.

### 6. Real-world example

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
ENTRYPOINT ["node"]
CMD ["server.js"]
```

This is a common pattern for Node.js applications.

## Questions to Answer

- Q: Which language is used?
  A: JavaScript (Node.js)

- Q: Which framework?
  A: Express.js

- Q: Maven or Gradle?
  A: Neither; this project uses Node.js with npm.

- Q: Java version?
  A: Not applicable for this project.

- Q: Does a Dockerfile already exist?
  A: Yes, the backend includes a Dockerfile.

- Q: Is there a README?
  A: Yes, this README file exists.

- Q: Does the application require a database?
  A: Yes, it uses PostgreSQL through the pg package.


Let's Understand Docker concept:

when if perfrom:
>>docker run nginx

docker does three things:
    1) create the container from images
    2) mounts the filesystem
    3) start one main process

    `that main process call as PID1

IF PID1 is exit  = nginx exit = container exits

A Container is exists only as long as it's main proccss is running.


What is entrypoint 
>> This is main application that should always run.

Exmaple: 
ENTRYPOINT ['java','-jar', 'app.jar' ]

NOW when user run
>> docker run myapp

Docker execute
java -jar app.jar

ENTRYPOINT IS FIXED COMMAND.

What is CMD ?

CMD provides..
Dafault argument  to Entrypoint.

Exmple: 

ENTRYPOINT ['java','-jar','app.jar']
CMD ["server.port=8080"]
 
 Docker combines them.
 >>java -jar app.jar server.port=8080

 2) Exmple :
    Suppose 
        Entrypoint ['ping']
        CMD ["google.com"]
   >>docker run myimage     
output
    >> ping google.com
    CMD act as Argument

3) Entrypoint ["ping"]
    CMD ["google.com"]

    >>docker run myimage yaaho.com
    output
    >> ping yahho.com
    
    NOTICE: CMD is Overriden ,But Entrypoint is fixed.

4) 
What if only CMD exists?

Dockerfile

CMD ["echo","Hello"]

Running

docker run image

Output

Hello

Now

docker run image date

CMD is completely replaced.

Docker executes

date

So CMD is easy to override.

5) IF only ENTRYPOINTS EXISTS
    ENTRYPOINT ["echo" ,"hello" ]
    >>hello
    if 
    docker run image Date
    >> echo hello date
because docker append extra agruments to entrypoint command.

Why We used ENTRYPOINT Insted of CMD ?
>> Entrypint define the main executable of the container and ensures the application always start consistently.
CMD 


Stage 1>> 
  I have started Building docker Images
  >> docker compose up -d
  