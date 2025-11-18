# Eureka Service Discovery Server

This is the Netflix Eureka service discovery server for the Buy-01 e-commerce platform.

## Purpose

Eureka acts as a central registry where all microservices register themselves. This enables:
- **Service Discovery**: Services can find each other by name instead of hardcoded URLs
- **Load Balancing**: Multiple instances of a service can register, and clients can load balance
- **Health Monitoring**: Eureka tracks which services are healthy and available

## Running the Server

### Local Development
```bash
mvn clean install
mvn spring-boot:run
```

### Docker
```bash
# Build
docker build -t buyapp/eureka-server:1.0.0 .

# Run
docker run -p 8761:8761 buyapp/eureka-server:1.0.0
```

## Accessing the Dashboard

Once running, visit: http://localhost:8761

You'll see:
- Registered services (applications)
- Instance status and health
- General server information

## Health Check

```bash
curl http://localhost:8761/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

## Configuration

Key configuration properties in `application.yml`:
- `server.port`: 8761 (standard Eureka port)
- `eureka.client.register-with-eureka`: false (doesn't register with itself)
- `eureka.client.fetch-registry`: false (doesn't fetch from itself)

## Next Steps

After Eureka is running:
1. Extract User Service and register it with Eureka
2. Extract Product Service and register it with Eureka
3. Extract Media Service and register it with Eureka
4. Set up API Gateway to route through Eureka
