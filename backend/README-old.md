# Buy-01 E-commerce Backend

A RESTful CRUD API for user and product management, built with Spring Boot, MongoDB, and JWT authentication.

## Features

- **User Management:**  
  - Register via `/auth/register`
  - Login via `/auth/login`
  - View/update/delete own profile via `/users/me`
  - Admin can manage all users (except admin cannot be deleted)
  - `POST /users` is admin-only (for admin to create users)
  - **Cascading delete:** When a user is deleted, all their products are automatically removed
- **Product Management:**  
  - Create, read, update, delete products
  - Only owner or admin can modify/delete
  - Public can view products
  - Products are linked to users by internal user ID (emails shown for display)
- **Authentication:**  
  - JWT-based login and registration
  - Tokens can be sent via Authorization header OR HttpOnly cookies
  - Logout via `/auth/logout` (JWT token is blacklisted and cookie cleared)
- **Authorization:**  
  - Role-based access (`USER`, `ADMIN`)
  - Only one admin, all others are users
- **Security:**  
  - BCrypt password hashing
  - Input validation
  - Sensitive info protection (no passwords in responses, user IDs hidden)
  - HTTPS ready
  - JWT token blacklist for logout
- **Error Handling:**  
  - Centralized exception handler
  - No 5XX errors, proper HTTP status codes
- **CORS:**  
  - Configured for local development
- **MongoDB:**  
  - Used for persistent storage
- **Data Integrity:**  
  - Transactional operations for data consistency
  - Cascading deletes maintain referential integrity

## Quick Start

### Prerequisites

- Java 17+
- Maven
- MongoDB (local or Docker: `docker run -d -p 27017:27017 mongo`)

### Running the Project

#### Option 1: Running in Terminal

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd buy-01
   ```

2. **Start MongoDB** (if not running):
   ```sh
   docker run -d -p 27017:27017 mongo
   ```

3. **Make Maven wrapper executable** (if needed):
   ```sh
   chmod +x mvnw
   ```

4. **Build and run:**
   ```sh
   ./mvnw spring-boot:run
   ```

5. **To stop the application:**
   - Press `Ctrl+C` (or `Cmd+C` on Mac) in the terminal
   - Or in another terminal: `pkill -f "spring-boot:run"`

#### Option 2: Running in IntelliJ IDEA

1. **Open the project:**
   - File → Open → Select the `buy-01` folder (containing `pom.xml`)
   - IntelliJ will automatically detect it as a Maven project

2. **Start MongoDB** (if not running):
   ```sh
   docker run -d -p 27017:27017 mongo
   ```

3. **Run the application:**
   - **Method A:** Click the green ▶️ button next to the `main` method in `EcommerceApplication.java`
   - **Method B:** Right-click `EcommerceApplication.java` → Run 'EcommerceApplication'
   - **Method C:** Use Run Configuration:
     - Run → Edit Configurations → ➕ → Spring Boot
     - Name: `Buy-01 Backend`
     - Main class: `com.buyapp.ecommerce.EcommerceApplication`
     - Click OK → Run

4. **To stop the application:**
   - Click the red ⏹️ stop button in the Run panel
   - Or use `Ctrl+F2` (Windows/Linux) / `Cmd+F2` (Mac)

#### Both Methods Result In:
- **API available at:** `https://localhost:8443` (HTTPS with self-signed certificate)
- **Console output:** Shows startup logs and request handling
- **MongoDB connection:** Automatically connects to `localhost:27017`

#### Troubleshooting

**Terminal Issues:**
- `./mvnw: Permission denied` → Run: `chmod +x mvnw`
- `./mvnw: No such file or directory` → Make sure you're in the project root directory
- Maven wrapper missing → The `.mvn/wrapper/` directory and files should exist (auto-created if missing)

**IntelliJ Issues:**
- Project not recognized as Maven → File → Reload Maven Projects
- Java version mismatch → File → Project Structure → Project → Set SDK to Java 17+
- Port already in use → Stop other applications using port 8443 or change port in `application.properties`

**MongoDB Issues:**
- Connection refused → Make sure MongoDB is running: `docker ps` should show mongo container
- Start MongoDB: `docker run -d -p 27017:27017 mongo`

**SSL Certificate Issues:**
- Browser warning about untrusted certificate → This is normal for development, click "Advanced" → "Proceed"
- Generate new certificate if needed (see bottom of README)

### API Endpoints

#### Auth

- `POST /auth/login` — Login, returns JWT (in response body AND HttpOnly cookie)
- `POST /auth/register` — Register, returns JWT (in response body AND HttpOnly cookie)
- `POST /auth/logout` — Logout, blacklists JWT token and clears cookie

**Authentication Methods:**
- **Option 1:** Use `Authorization: Bearer <token>` header (traditional)
- **Option 2:** Login automatically sets HttpOnly cookie (more secure for web apps)

#### Users

- `GET /users` — List all users (admin only)
- `GET /users/{id}` — Get user by ID (admin only)
- `GET /users/me` — Get current user's info
- `POST /users` — Create user (admin only)
- `PUT /users/{id}` — Update user (admin or self, email must be unique)
- `DELETE /users/{id}` — Delete user and all associated products (admin only, cannot delete admin)
- `DELETE /users/me` — Delete own account and all associated products

#### Products

- `GET /products` — List all products (public)
- `GET /products/{id}` — Get product by ID (public)
- `POST /products` — Create product (authenticated)
- `PUT /products/{id}` — Update product (owner or admin)
- `DELETE /products/{id}` — Delete product (owner or admin)
- `GET /products/my-products` — List current user's products

### Security

- **JWT:** Authentication via `Authorization: Bearer <token>` header OR HttpOnly cookies.
- **Cookie Security:** HttpOnly, Secure (HTTPS), SameSite protection against XSS/CSRF.
- **Roles:** Only admin can manage users; users can only manage their own profile and products.
- **Password:** Hashed with BCrypt.
- **Privacy:** User IDs are never exposed in API responses; only emails are shown for display.
- **Data Integrity:** Transactional operations ensure cascading deletes maintain consistency.
- **HTTPS:** Configured for production.
- **CORS:** Configured for local frontend development.
- **Logout:** Blacklists JWT token and clears cookie so it cannot be reused.

### Error Handling

- All errors return structured JSON with status, error, message, and path.
- No 5XX errors; all exceptions handled.
- **Common validation errors:**
  - Email already exists (400) - during registration or profile update
  - Invalid user credentials (401) - during login
  - Unauthorized access (403) - trying to access/modify other users' data
  - Resource not found (404) - invalid user/product IDs

### Testing

- Use Postman or similar tool.
- Register/login to get JWT.
- **Two authentication methods:**
  - **Header-based:** Use `Authorization: Bearer <token>` header
  - **Cookie-based:** Login sets HttpOnly cookie automatically
- Test all endpoints with and without JWT.
- Try error scenarios (invalid credentials, unauthorized access, etc.).
- Test logout: after calling `/auth/logout`, the token is blacklisted and cookie cleared.
- **Test cascading delete:** Create products for a user, then delete the user to verify all their products are automatically removed.
- **Test email uniqueness:** Try updating a user's email to one that already exists - should return 400 Bad Request.

### Bonus

- **CORS:** Configured.
- **Rate Limiting:** Not implemented (can be added as a filter).

## Project Structure

```
buy-01/
├── src/
│   ├── main/
│   │   ├── java/com/toft/buy-01/
│   │   │   ├── model/        # User, Product
│   │   │   ├── repository/   # UserRepository, ProductRepository, BlacklistedTokenRepository
│   │   │   ├── service/      # UserService, ProductService
│   │   │   ├── controller/   # UserController, ProductController, AuthController
│   │   │   ├── security/     # SecurityConfig, JwtUtil, JwtAuthenticationFilter, CustomUserDetailsService, TokenBlacklist, BlacklistedToken
│   │   │   ├── exception/    # GlobalExceptionHandler, custom exceptions
│   │   │   ├── dto/          # UserDto, ProductDto
│   │   └── resources/
│   │       ├── application.properties
│   │       └── keystore.p12  # Self-signed cert for HTTPS
│   └── test/java/com/toft/buy-01/
│       └── EcommerceApplicationTests.java
├── .gitignore
├── pom.xml
├── README.md
└── TODO.md
```

## Generate a new self-signed certificate for development
```
keytool -genkeypair -alias buy-01 -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore src/main/resources/keystore.p12 -validity 3650 -storepass changeit -dname "CN=localhost, OU=Development, O=BuyApp, L=City, ST=State, C=US"
```

## Requirements
- Java 17
- Maven
- MongoDB

---

**Ready for audit and production use.**