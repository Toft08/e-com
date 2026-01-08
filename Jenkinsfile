pipeline {
    agent any

    // Automatic build trigger on new commits
    triggers {
        pollSCM('H/2 * * * *')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        JAVA_HOME = tool name: 'JDK-17', type: 'jdk'
        NODE_HOME = tool name: 'NodeJS-20', type: 'nodejs'
        PATH = "${JAVA_HOME}/bin:${NODE_HOME ?: '/usr'}/bin:${PATH}"
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from repository"
                checkout scm
            }
        }

        stage('Build Shared Module') {
            steps {
                echo "Building shared module..."
                dir('backend/shared') {
                    sh '../mvnw clean install -DskipTests -q'
                }
            }
        }

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

        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        sh '''
                            echo "Running backend tests on pre-compiled code..."
                            
                            # Run tests (code already compiled in previous stage)
                            cd backend/services/user && ../../mvnw test -q && cd ../..
                            cd backend/services/product && ../../mvnw test -q && cd ../..
                            cd backend/services/media && ../../mvnw test -q && cd ../..
                            cd backend/services/eureka && ../../mvnw test -q && cd ../..
                            cd backend/api-gateway && ../mvnw test -q
                        '''
                    }
                    post {
                        always {
                            junit 'backend/**/target/surefire-reports/*.xml'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        sh '''
                            echo "Running frontend tests in isolated Chrome container..."

                            docker run --rm \
                              --volumes-from jenkins \
                              -w ${WORKSPACE}/frontend \
                              --tmpfs /tmp:rw,exec,nosuid,size=2g \
                              --cap-add=SYS_ADMIN \
                              node:22-slim \
                              bash -c '
                                echo "Installing Chrome and dependencies..." && \
                                apt-get update && \
                                apt-get install -y chromium chromium-driver --no-install-recommends && \
                                apt-get clean && \
                                rm -rf /var/lib/apt/lists/* && \
                                echo "Node version: $(node --version)" && \
                                echo "Copying files to /tmp..." && \
                                mkdir -p /tmp/test && \
                                cp -r . /tmp/test/ && \
                                cd /tmp/test && \
                                npm install --legacy-peer-deps --cache /tmp/.npm --no-save --no-package-lock && \
                                CHROME_BIN=/usr/bin/chromium npm run test
                              ' || {
                                EXIT_CODE=$?
                                echo "Frontend tests failed with exit code: $EXIT_CODE"
                                exit $EXIT_CODE
                            }
                            echo "✅ Frontend tests passed"
                        '''
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh '''
                    # Generate SSL certificates if needed
                    if [ ! -f "frontend/ssl/localhost-cert.pem" ]; then
                        ./generate-ssl-certs.sh
                    fi

                    # Build Docker images
                    docker-compose -f docker-compose.yml -f docker-compose.ci.yml build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    # Stop old containers
                    docker-compose -f docker-compose.yml -f docker-compose.ci.yml down || true

                    # Force remove any lingering containers with ecom- prefix
                    docker ps -a | grep ecom- | awk '{print $1}' | xargs -r docker rm -f || true

                    # Start new containers
                    docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d

                    # Wait for services to be healthy
                    echo "Waiting for services to start..."
                    sleep 30

                    # Verify services are running
                    docker-compose -f docker-compose.yml -f docker-compose.ci.yml ps
                '''
            }
            post {
                failure {
                    script {
                        echo "Deployment failed - Rolling back"
                        sh '''
                            docker-compose -f docker-compose.yml -f docker-compose.ci.yml down || true
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Build completed: ${currentBuild.currentResult}"
        }
        success {
            script {
                def commitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                if (env.EMAIL_ENABLED == 'true') {
                    def emailRecipients = env.EMAIL_RECIPIENTS ?: 'anastasia.suhareva@gmail.com, toft.diederichs@gritlab.ax'
                    def recipientList = emailRecipients.split(',').collect { it.trim() }
                    emailext (
                        subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
                            Build succeeded!
                            Project: ${env.JOB_NAME}
                            Build Number: #${env.BUILD_NUMBER}
                            Commit: ${commitMessage}
                            Build URL: ${env.BUILD_URL}
                        """,
                        to: recipientList.join(','),
                        mimeType: 'text/html'
                    )
                }
            }
        }
        failure {
            script {
                def commitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                if (env.EMAIL_ENABLED == 'true') {
                    def emailRecipients = env.EMAIL_RECIPIENTS ?: 'anastasia.suhareva@gmail.com, toft.diederichs@gritlab.ax'
                    def recipientList = emailRecipients.split(',').collect { it.trim() }
                    emailext (
                        subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
                            Build failed!
                            Project: ${env.JOB_NAME}
                            Build Number: #${env.BUILD_NUMBER}
                            Commit: ${commitMessage}
                            Build URL: ${env.BUILD_URL}
                            Please check the build logs for details.
                        """,
                        to: recipientList.join(','),
                        mimeType: 'text/html'
                    )
                }
            }
        }
    }
}
