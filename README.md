# Backend Capstone Project

A scalable, event-driven backend system built with **NestJS**, designed using a microservices architecture.  
The system focuses on media processing, real-time interactions, and distributed system design using a hybrid communication model.

---

## Overview

This project is a backend platform that supports:

- User authentication with role-based permissions.
- Media upload and asynchronous processing pipeline
- Event-driven communication between services
- Infinitely nested comment system
- API Gateway as the unified entry point

The goal is to simulate production-grade backend architecture with a strong focus on scalability, decoupling, and distributed systems design.

---

## Architecture

The system follows a microservices architecture composed of independently deployable services:

- API Gateway
- Auth Service
- Media Service
- Comment Service
- Event-driven messaging layer (Kafka, TCP, SQS)

Each service is responsible for its own domain and database, communicating through a combination of synchronous and asynchronous patterns depending on the use case.


## Database Architecture

Each service owns its own database (database-per-service pattern).

Technologies used:

- PostgreSQL for relational data storage
- TypeORM for object-relational mapping

Design principles:

- Services are fully decoupled at the database level
- Data ownership is strictly enforced per service
- Relations are carefully modeled to avoid cross-service coupling

Performance considerations include selective loading strategies and optimized query patterns.

---

## Tech Stack

- **Backend Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Messaging / Queueing:**
  - Kafka (asynchronous event-driven communication)
  - TCP (synchronous request/response communication between services)
  - AWS SQS (background jobs)
- **Authentication:** JWT + cookies

---

## Project Goals

This project is designed to demonstrate:

- Real-world backend system architecture
- Microservice communication patterns
- Event-driven distributed systems
- Scalable media processing pipelines
- Practical NestJS production-level engineering

---


## Status

This project is actively evolving.  
Core services are implemented, with additional features (comments, real-time features, analytics, streaming) in progress or planned.

---