## Day 1 – Setup & Basics

Install Java 17+ and MongoDB (or run it with Docker: docker run -d -p 27017:27017 mongo).

Use Spring Initializr → select:

Spring Web

Spring Data MongoDB

Spring Security

Validation

Create models:

User (@Document, @Id, fields with @NotBlank, @Email, etc.)

Product (@Document, @Id, Double price, String userId)

Repositories: UserRepository, ProductRepository (extends MongoRepository).

Audit coverage: annotations, Mongo connection, validation.

## Day 2 – CRUD for User

UserController with CRUD (@GetMapping, @PostMapping, etc.).

UserService with repo calls.

Hash passwords with BCrypt when creating users.

Make DTOs → never return password.

Audit coverage: CRUD, password hashing, sensitive info protection.

## Day 3 – CRUD for Product

Same structure as User (controller + service).

CRUD works, but for now no authentication → just test with Postman.

Audit coverage: CRUD operations.

## Day 4 – Authentication (JWT)

Implement JWT filter + SecurityConfig.

Add /auth/login endpoint → takes email/password, validates, returns JWT.

Make GET /products public (permitAll).

Lock down everything else → only JWT-authenticated users can access.

Audit coverage: authentication, GET products public.

## Day 5 – Authorization (Roles)

Add role field to User.

Use @PreAuthorize("hasRole('ADMIN')") for User CRUD.

For Products:

Admin → can CRUD any product.

User → can only CRUD their own (check userId in service).

Audit coverage: role-based access control.

## Day 6 – Error Handling & Security

Add @ControllerAdvice with @ExceptionHandler → return ResponseEntity with 400/404/401.

Input validation with @Valid in controllers.

HTTPS note: you don’t need real HTTPS, just configure application.properties to force it in prod.

Sanity check: no passwords in responses, all inputs validated.

Audit coverage: no 5XX, proper status codes, validation.

## Day 7 – Polish & Testing

Add CORS config (WebMvcConfigurer).

(Optional bonus) Add a simple rate limiter (Bucket4j or custom filter).

Write a few Postman tests:

Register → Login → Get JWT → CRUD product.

Ensure GET /products works without JWT.

Audit coverage: CORS, rate limiting bonus, full functional test.

⚡ What Must Be Hit for the Audit

CRUD Users + Products

JWT auth

Role-based auth

GET /products public

Error handling (404, 400, 401)

Hashed passwords

No sensitive info in responses

Validation annotations 

Annotations for REST 

(Do bonus only if I finish early.)