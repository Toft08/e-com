# Buy-01 Backend Services

Spring Boot microservices architecture with Eureka service discovery, API Gateway, and MongoDB persistence. Implements JWT authentication, role-based access control, and event-driven communication with Kafka.

## Services Overview

| Service | Port | Description | Database |
|---------|------|-------------|----------|
| **Eureka Server** | 8761 | Service discovery and registry | - |
| **API Gateway** | 8080 | Spring Cloud Gateway with JWT validation | - |
| **User Service** | 8081 | User registration, authentication, JWT tokens | user_service_db |
| **Product Service** | 8082 | Product CRUD with ownership validation | product_service_db |
| **Media Service** | 8083 | Image upload, storage, and retrieval | media_service_db |

**Additional Components:**
- **MongoDB**: Single instance with separate databases per service
- **Kafka**: Event streaming for inter-service communication (MediaEventProducer)

## Features

### User Service
- **Registration**: Create CLIENT or SELLER accounts
- **Authentication**: Login with email/password, returns JWT
- **JWT Token Management**: Issue, validate, and blacklist tokens
- **Profile Management**: View/update user info, delete account
- **Cascading Delete**: Deleting a user removes all their products and media
- **Security**: BCrypt password hashing, unique email validation

### Product Service  
- **Public Access**: List all products, view product details
- **Seller Operations**: Create, update, delete products
- **Ownership Validation**: Only product owner can modify/delete
- **User Enrichment**: Automatically adds user's name to products
- **Cross-Service Communication**: Notifies Media Service on product deletion

### Media Service
- **Image Upload**: 2MB max, `image/*` MIME types only
- **Storage**: Local filesystem at `uploads/images/`
- **Validation**: Frontend + backend file size/type checking
- **Ownership**: Only seller can upload/delete their product images
- **Kafka Events**: Publishes IMAGE_UPLOADED events
- **Product Association**: Links images to products

### API Gateway
- **Routing**: Routes requests to appropriate microservices
- **CORS**: Configured for frontend on port 4200
- **JWT Validation**: Validates tokens before forwarding requests
- **Load Balancing**: Uses Eureka for service discovery and load balancing
- **HTTPS**: SSL/TLS termination with self-signed certificates

### Eureka Server
- **Service Registry**: All microservices register on startup
- **Health Monitoring**: Tracks service health with heartbeats
- **Discovery**: Enables dynamic service lookup
- **Dashboard**: Web UI at http://localhost:8761

## Prerequisites

- **Java**: JDK 17 or higher
- **Maven**: 3.6+ (or use included `mvnw` wrapper)
- **MongoDB**: 4.4+ running on localhost:27017
- **Kafka** (optional): 3.8.1 for event streaming

## Quick Start

### Option 1: Docker Compose (Recommended)

See [main README](../README.md) for Docker setup.

### Option 2: Manual Setup

#### 1. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Or install MongoDB locally
brew install mongodb-community  # macOS
sudo apt install mongodb        # Ubuntu
```

#### 2. Start Kafka (Optional)

```bash
# Using Docker
docker run -d -p 9092:9092 apache/kafka:3.8.1
```

#### 3. Build All Services

```bash
cd backend
./mvnw clean install
```

#### 4. Start Services (in order)

```bash
# Terminal 1: Eureka Server
cd services/eureka
../../mvnw spring-boot:run

# Terminal 2: User Service (wait for Eureka)
cd services/user
../../mvnw spring-boot:run

# Terminal 3: Product Service
cd services/product
../../mvnw spring-boot:run

# Terminal 4: Media Service
cd services/media
../../mvnw spring-boot:run

# Terminal 5: API Gateway
cd api-gateway
../mvnw spring-boot:run
```

**Startup Order Matters**: Eureka must start first, then services register with it, finally Gateway can route to them.

## Configuration

### MongoDB Connection

All services use authentication. Update `application.yml` if needed:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:password@localhost:27017/[database_name]?authSource=admin
```

### JWT Configuration

User Service generates JWT tokens. Update secret in `application.yml`:

```yaml
jwt:
  secret: your-256-bit-secret-key-here
  expiration: 86400000  # 24 hours in milliseconds
```

### Service Registration

Each service registers with Eureka on startup:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

### CORS Configuration (API Gateway)

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "https://localhost:4200"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
```

## API Documentation

### Authentication Endpoints

#### POST /auth/register
Register new user.

**Request:**
```json
{
  "name": "John Seller",
  "email": "john@example.com",
  "password": "password123",
  "role": "SELLER",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "507f1f77bcf86cd799439011",
  "name": "John Seller",
  "email": "john@example.com",
  "role": "SELLER",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### POST /auth/login
Authenticate user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "507f1f77bcf86cd799439011",
  "name": "John Seller",
  "email": "john@example.com",
  "role": "SELLER"
}
```

#### POST /auth/logout
Blacklist token and clear cookies.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `"Logout successful"`

### User Endpoints

#### GET /users/me
Get current user's profile (authenticated).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Seller",
  "email": "john@example.com",
  "role": "SELLER",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### DELETE /users/me
Delete own account and all associated products/media.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `"User deleted successfully"`

### Product Endpoints

#### GET /products
List all products (public).

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Awesome Product",
    "description": "Best product ever",
    "price": 29.99,
    "quality": 95,
    "userId": "507f1f77bcf86cd799439011",
    "user": "John Seller"
  }
]
```

#### GET /products/{id}
Get product details (public).

#### POST /products
Create new product (SELLER only).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Awesome Product",
  "description": "Best product ever",
  "price": 29.99,
  "quality": 95
}
```

**Response (201):** Product object

#### PUT /products/{id}
Update product (owner only).

**Headers:** `Authorization: Bearer <token>`

#### DELETE /products/{id}
Delete product and all associated media (owner only).

**Headers:** `Authorization: Bearer <token>`

#### GET /products/my-products
Get current user's products (authenticated).

**Headers:** `Authorization: Bearer <token>`

### Media Endpoints

#### POST /media/upload/{productId}
Upload product image (SELLER, owner only).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file (max 2MB, `image/*`)

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "fileName": "product-image.jpg",
  "filePath": "uploads/images/1234567890_product-image.jpg",
  "contentType": "image/jpeg",
  "fileSize": 1048576,
  "productId": "507f1f77bcf86cd799439012",
  "sellerId": "507f1f77bcf86cd799439011"
}
```

#### GET /media/product/{productId}
Get all images for a product (public).

#### GET /media/file/{mediaId}
Serve image file (public).

**Response:** Image bytes with appropriate `Content-Type` header

#### DELETE /media/{mediaId}
Delete media file (owner only).

**Headers:** `Authorization: Bearer <token>`

## Security Implementation

### JWT Authentication
1. User logs in via `/auth/login`
2. User Service generates JWT token with user ID, email, role
3. Token returned in response body + HttpOnly cookie
4. Client includes token in `Authorization: Bearer <token>` header
5. API Gateway validates token before forwarding request
6. Service extracts user info from `X-User-ID`, `X-User-Email`, `X-User-Role` headers

### Token Blacklisting
- Logout adds token to in-memory blacklist
- Gateway checks blacklist before validation
- Prevents reuse of logged-out tokens

### Role-Based Access Control
- **PUBLIC**: Anyone can view products, media
- **CLIENT**: Can manage own profile
- **SELLER**: Can create/manage products and upload media

### Ownership Validation
- Product/Media services check if authenticated user owns the resource
- User ID from JWT compared to resource's `userId`/`sellerId`
- Returns 403 Forbidden if ownership check fails

### Password Security
- Passwords hashed with BCrypt (strength 10)
- Never stored or returned in plain text
- Login compares BCrypt hash

## Error Handling

All services use `@RestControllerAdvice` for consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists",
  "path": "/auth/register"
}
```

**Common Status Codes:**
- **400**: Bad Request (validation errors, duplicate email)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions, not owner)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (unexpected errors)

## Testing

### Integration Tests

```bash
# Run all integration tests (28 tests)
cd backend
./mvnw test

# Test specific service
cd services/user
../../mvnw test
```

**Test Framework:**
- **@SpringBootTest**: Full application context
- **MockMvc**: HTTP endpoint testing
- **Testcontainers**: Isolated MongoDB per test class
- **JUnit 5**: Modern testing framework

**Test Coverage:**
- User Service: 8 tests (registration, login, validation, cascading delete)
- Product Service: 10 tests (CRUD, authorization, ownership)
- Media Service: 10 tests (upload, download, size limits, MIME types)

See [INTEGRATION-TESTING.md](../INTEGRATION-TESTING.md) for complete testing guide.

### Manual Testing with curl

```bash
# Register seller and capture token
TOKEN=$(curl -s -X POST https://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123","role":"SELLER"}' \
  -k | jq -r '.token')

# Create product
PRODUCT_ID=$(curl -s -X POST https://localhost:8080/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","description":"Test","price":19.99,"quality":90}' \
  -k | jq -r '.id')

# Upload image
curl -X POST https://localhost:8080/media/upload/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -k

# View products (no auth)
curl https://localhost:8080/products -k
```

## Kafka Events

### MediaEventProducer

Publishes events when media is uploaded:

**Topic:** `media-events`

**Event:**
```json
{
  "eventType": "IMAGE_UPLOADED",
  "mediaId": "507f1f77bcf86cd799439013",
  "productId": "507f1f77bcf86cd799439012",
  "fileName": "product-image.jpg",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Use Cases:**
- Image processing (resize, optimize)
- Analytics tracking
- Notification systems
- Audit logging

## Project Structure

```
backend/
├── api-gateway/
│   ├── src/main/
│   │   ├── java/com/buyapp/gateway/
│   │   │   ├── config/          # CORS, Security config
│   │   │   └── filter/          # JWT validation filter
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
├── services/
│   ├── eureka/
│   │   ├── src/main/
│   │   │   └── resources/application.yml
│   │   └── pom.xml
│   ├── user/
│   │   ├── src/main/java/com/buyapp/user/
│   │   │   ├── model/           # User, BlacklistedToken
│   │   │   ├── repository/      # MongoDB repositories
│   │   │   ├── service/         # Business logic
│   │   │   ├── controller/      # REST endpoints
│   │   │   ├── security/        # JWT, BCrypt, Security config
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   └── exception/       # Custom exceptions
│   │   └── src/test/java/       # Integration tests
│   ├── product/
│   │   ├── src/main/java/com/buyapp/product/
│   │   │   ├── model/           # Product
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── controller/
│   │   │   ├── client/          # Feign client for User Service
│   │   │   └── exception/
│   │   └── src/test/java/
│   └── media/
│       ├── src/main/java/com/buyapp/media/
│       │   ├── model/           # Media
│       │   ├── repository/
│       │   ├── service/
│       │   ├── controller/
│       │   ├── kafka/           # MediaEventProducer
│       │   └── exception/
│       ├── src/test/java/
│       └── uploads/images/      # Uploaded files
└── shared/                      # Shared models/utilities
    └── src/main/java/com/buyapp/shared/
```

## Troubleshooting

### Service Won't Start
- Ensure MongoDB is running: `docker ps` or `brew services list mongodb-community`
- Check port availability: `lsof -i :8080` (kill conflicting processes)
- Verify Java version: `java -version` (need 17+)

### Eureka Registration Failed
- Confirm Eureka Server running on port 8761
- Check `eureka.client.service-url.defaultZone` in `application.yml`
- Wait 30 seconds for initial registration

### 401 Unauthorized Errors
- Verify token not expired (24 hour lifetime)
- Check token in `Authorization: Bearer <token>` header
- Ensure token not blacklisted (logout invalidates token)

### MongoDB Connection Issues
- Verify credentials: `admin`/`password` with `authSource=admin`
- Check MongoDB logs: `docker logs <mongo-container-id>`
- Test connection: `mongosh mongodb://admin:password@localhost:27017/admin`

### File Upload Fails
- Verify file size ≤ 2MB: `ls -lh image.jpg`
- Check MIME type is `image/*`: `file --mime-type image.jpg`
- Ensure uploads directory exists and has write permissions

## Related Documentation

- [Main README](../README.md) - Project overview and Docker setup
- [Frontend README](../frontend/README.md) - Angular frontend documentation
- [INTEGRATION-TESTING.md](../INTEGRATION-TESTING.md) - Testing guide
- [Task.md](../Task.md) - Original project requirements
