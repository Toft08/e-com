# User Service

A microservice for handling user authentication and management in the Buy-01 e-commerce platform.

## Features

- User registration and authentication
- JWT token generation and validation
- User profile management
- Role-based access control (CLIENT, SELLER)
- Inter-service communication via WebClient
- Eureka service discovery integration

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication  
- `POST /auth/logout` - User logout

### User Management
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/{id}` - Get user by ID (internal/admin)
- `GET /users` - Get all users (admin only)
- `POST /users` - Create user (admin only)
- `PUT /users/{id}` - Update user (admin only)
- `DELETE /users/{id}` - Delete user (admin only)
- `DELETE /users/me` - Delete current user

## Configuration

### Database
- MongoDB database: `user_service_db`
- Default connection: `localhost:27017`

### Service Discovery
- Eureka server: `http://localhost:8761/eureka/`
- Service port: `8081`

### Security
- JWT authentication using shared-common module
- Password encryption with BCrypt
- Cookie-based JWT storage

## Dependencies

- Spring Boot 3.5.5
- Spring Security
- Spring Data MongoDB
- Spring Cloud Eureka Client
- Spring WebFlux (for inter-service communication)
- shared-common module

## Running the Service

```bash
cd backend/user-service
../mvnw spring-boot:run
```

The service will start on port 8081 and register with Eureka discovery server.

## Inter-Service Communication

The service uses WebClient with load balancing for calling other microservices:
- Product service integration for user deletion (sellers)
- Future integration with other services as needed