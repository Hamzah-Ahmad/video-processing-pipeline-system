# Backend Capstone Project

A scalable, event-driven backend system built with **NestJS**, designed using a microservices architecture.  
The system focuses on media processing, real-time interactions, and distributed system design using a hybrid communication model.

---

## Overview

This project is a backend platform that supports:

- User authentication and session handling
- Media upload and asynchronous processing pipeline
- Event-driven communication between services
- Social interactions (comments and likes - in progress)
- API Gateway as the unified entry point

The goal is to simulate production-grade backend architecture with a strong focus on scalability, decoupling, and distributed systems design.

---

## Architecture

The system follows a microservices architecture composed of independently deployable services:

- API Gateway
- Auth Service
- Media Service
- Comment Service (in progress)
- Event-driven messaging layer (Kafka, TCP, SQS)

Each service is responsible for its own domain and database, communicating through a combination of synchronous and asynchronous patterns depending on the use case.

---

## Communication Layer

This system uses a **hybrid communication model** depending on latency, reliability, and consistency requirements.

### Kafka (Event Streaming)

Kafka is used for durable, event-driven workflows between services.

Typical events include:

- `media.uploaded`
- `media.processed`
- `comment.created`

Kafka is best used for:

- Decoupled service communication
- High-throughput event streaming
- Asynchronous workflows

---

### TCP (NestJS Microservice Transport)

TCP is used for lightweight synchronous communication between internal services.

It is typically used for:

- Internal service-to-service requests
- Authentication validation flows
- Low-latency direct communication

TCP provides a simple and fast RPC-style mechanism without HTTP overhead.

---

### AWS SQS (Message Queue)

SQS is used for reliable background job processing and task buffering.

It is used for:

- Media transcoding jobs
- Retry-safe asynchronous processing
- Worker-based job execution

SQS ensures:

- Guaranteed message delivery
- Fault tolerance
- Load buffering during traffic spikes

---

## Core Services

### API Gateway

The API Gateway acts as the single entry point into the system.

Responsibilities:

- Request routing to microservices
- Authentication middleware handling
- Aggregating responses from multiple services
- Abstracting internal service structure from clients

---

### Auth Service

Handles all authentication and identity-related logic.

Responsibilities:

- User registration and login
- JWT token generation and validation
- Session and cookie handling
- Shared identity across services

---

### Media Service

Responsible for all media-related workflows.

Responsibilities:

- File upload handling
- Metadata storage in PostgreSQL
- Asynchronous processing pipeline
- Emitting events for downstream services

This service plays a central role in the event-driven architecture.

---

### Comment Service (In Progress)

Handles user interaction features such as comments and replies.

Planned responsibilities:

- Create and manage comments
- Reply-to-comment functionality
- Event-driven updates for real-time features
- Integration with media and user services

---

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

## Key Concepts Implemented

This project demonstrates:

- Microservices architecture with NestJS
- Event-driven design using Kafka, TCP, and SQS
- API Gateway pattern
- Async media processing pipelines
- Distributed system communication strategies
- Service decoupling and domain ownership
- Scalable backend architecture principles

---

## Tech Stack

- **Backend Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Messaging / Queueing:**
  - Kafka (event streaming)
  - TCP (NestJS microservice transport)
  - AWS SQS (background jobs)
- **Caching:** Redis (planned / partial usage)
- **Authentication:** JWT + cookies

---

## Planned Improvements

- Real-time WebSocket layer for comments and notifications
- Media streaming support (HLS / progressive delivery)
- Distributed rate limiting using Redis
- Analytics and event aggregation pipeline service
- Full Docker-based local development setup
- CI/CD pipeline integration
- Observability (logging, tracing, metrics)

---

## Project Goals

This project is designed to demonstrate:

- Real-world backend system architecture
- Microservice communication patterns
- Event-driven distributed systems
- Scalable media processing pipelines
- Practical NestJS production-level engineering

---

## Architecture Summary

This system intentionally mirrors production-grade backend platforms:

- Kafka → event streaming backbone
- SQS → reliable asynchronous processing
- TCP → fast internal service communication
- API Gateway → unified external interface

---

## Status

This project is actively evolving.  
Core services are implemented, with additional features (comments, real-time features, analytics, streaming) in progress or planned.

---