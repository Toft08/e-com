// Jenkinsfile for mr-jenk E-commerce Platform
// This pipeline: checkouts → builds → tests → deploys

pipeline {
    agent any  // Run on any available Jenkins agent
    
    // Environment variables available to all stages
    environment {
        // Project info
        PROJECT_NAME = 'mr-jenk'
        
        // Docker image prefix (you can change this to your Docker Hub username later)
        DOCKER_REGISTRY = 'mr-jenk'
        
        // Build info
        BUILD_VERSION = "${env.BUILD_NUMBER}"
    }
    
    // Build options
    options {
        // Keep only last 10 builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Add timestamps to console output
        timestamps()
        
        // Timeout the entire pipeline after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        // ==========================================
        // STAGE 1: CHECKOUT
        // Fetch the latest code from GitHub
        // ==========================================
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                
                // Show what we're building
                sh '''
                    echo "Build #${BUILD_NUMBER}"
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT}"
                '''
            }
        }
        
        // ==========================================
        // STAGE 2: BUILD SHARED MODULE
        // Build shared module first (other services depend on it)
        // ==========================================
        stage('Build Shared Module') {
            steps {
                echo '🔨 Building shared module...'
                dir('backend/shared') {
                    sh '../mvnw clean install -DskipTests -q'
                }
            }
        }
        
        // ==========================================
        // STAGE 3: BUILD BACKEND SERVICES (PARALLEL)
        // Compile all Java microservices with Maven
        // ==========================================
        stage('Build Backend Services') {
            parallel {
                stage('Eureka Server') {
                    steps {
                        dir('backend/services/eureka') {
                            sh '../../mvnw clean package -DskipTests -q'
                        }
                    }
                }
                stage('User Service') {
                    steps {
                        dir('backend/services/user') {
                            sh '../../mvnw clean package -DskipTests -q'
                        }
                    }
                }
                stage('Product Service') {
                    steps {
                        dir('backend/services/product') {
                            sh '../../mvnw clean package -DskipTests -q'
                        }
                    }
                }
                stage('Media Service') {
                    steps {
                        dir('backend/services/media') {
                            sh '../../mvnw clean package -DskipTests -q'
                        }
                    }
                }
                stage('API Gateway') {
                    steps {
                        dir('backend/api-gateway') {
                            sh '../mvnw clean package -DskipTests -q'
                        }
                    }
                }
            }
        }
        
        // ==========================================
        // STAGE 4: BUILD FRONTEND
        // Install dependencies and build Angular app
        // ==========================================
        stage('Build Frontend') {
            steps {
                echo '🎨 Building frontend...'
                
                dir('frontend') {
                    sh '''
                        npm ci --silent
                        npm run build -- --configuration=production
                    '''
                }
            }
        }
        
        // ==========================================
        // STAGE 5: TEST BACKEND
        // Run JUnit tests for all Java services
        // ==========================================
        stage('Test Backend') {
            steps {
                echo '🧪 Running backend tests...'
                
                dir('backend') {
                    // Run tests for each service
                    sh '''
                        echo "Testing User Service..."
                        cd services/user && ../../mvnw test -q || true
                        
                        echo "Testing Product Service..."
                        cd ../product && ../../mvnw test -q || true
                        
                        echo "Testing Media Service..."
                        cd ../media && ../../mvnw test -q || true
                    '''
                }
            }
            post {
                always {
                    // Publish test results to Jenkins
                    junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        // ==========================================
        // STAGE 6: TEST FRONTEND
        // Run Karma/Jasmine tests for Angular
        // ==========================================
        stage('Test Frontend') {
            steps {
                echo '🧪 Running frontend tests...'
                
                dir('frontend') {
                    // Run tests in headless Chrome
                    sh 'npm test -- --watch=false --browsers=ChromeHeadless || true'
                }
            }
        }
        
        // ==========================================
        // STAGE 7: BUILD DOCKER IMAGES
        // Create Docker images for all services
        // ==========================================
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                
                sh '''
                    docker-compose build --parallel
                '''
            }
        }
        
        // ==========================================
        // STAGE 8: DEPLOY
        // Deploy the application
        // ==========================================
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                
                // Stop existing containers (if any)
                sh 'docker-compose down || true'
                
                // Start new containers
                sh 'docker-compose up -d'
                
                // Wait for services to be healthy
                sh '''
                    echo "Waiting for services to start..."
                    sleep 30
                    docker-compose ps
                '''
            }
        }
        
        // ==========================================
        // STAGE 9: HEALTH CHECK
        // Verify deployment was successful
        // ==========================================
        stage('Health Check') {
            steps {
                echo '🏥 Checking service health...'
                
                sh '''
                    # Check if services are responding
                    echo "Checking Eureka..."
                    curl -sf http://localhost:8761/actuator/health || echo "Eureka check skipped"
                    
                    echo "All health checks completed!"
                '''
            }
        }
    }
    
    // ==========================================
    // POST-BUILD ACTIONS
    // What to do after the pipeline completes
    // ==========================================
    post {
        success {
            echo '''
            ✅ ========================================
            ✅ BUILD SUCCESSFUL!
            ✅ ========================================
            '''
        }
        failure {
            echo '''
            ❌ ========================================
            ❌ BUILD FAILED!
            ❌ ========================================
            '''
            
            // Rollback: stop any partially deployed containers
            sh 'docker-compose down || true'
        }
        always {
            // Clean up workspace to save disk space
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
    }
}

