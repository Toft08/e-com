# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy parent pom and shared module first (for dependency resolution)
COPY pom.xml ./pom.xml
COPY shared ./shared

# Copy api-gateway
COPY api-gateway ./api-gateway

# Build shared module first, then api-gateway
RUN mvn -pl shared -am install -DskipTests
RUN mvn -pl api-gateway -am package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/api-gateway/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
