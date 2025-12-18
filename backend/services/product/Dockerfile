# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy parent pom and shared module first (for dependency resolution)
COPY pom.xml ./pom.xml
COPY shared ./shared

# Copy this service
COPY services/product ./services/product

# Build shared module first, then this service
RUN mvn -pl shared -am install -DskipTests
RUN mvn -pl services/product -am package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/services/product/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
