# Build stage
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /build

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# Copy POM files first to cache Maven dependencies
COPY pom.xml ./
COPY shared/pom.xml ./shared/pom.xml
COPY services/user/pom.xml ./services/user/pom.xml

# Download dependencies (this layer will be cached if POMs don't change)
WORKDIR /build
RUN mvn dependency:go-offline -f pom.xml -pl shared,services/user -am || true

# Copy source code (this invalidates cache only when code changes)
COPY shared ./shared
COPY services/user ./services/user

# Build shared module first
WORKDIR /build
RUN mvn clean install -DskipTests -f pom.xml -pl shared -am

# Build user service
WORKDIR /build/services/user
RUN mvn clean package -DskipTests -f pom.xml

# Runtime stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

COPY --from=builder /build/services/user/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
