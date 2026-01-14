pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        GITHUB_TOKEN = credentials('github-token')
        JAVA_HOME = tool name: 'JDK-17', type: 'jdk'
        NODE_HOME = tool name: 'NodeJS-20', type: 'nodejs'
        PATH = "${JAVA_HOME}/bin:${NODE_HOME ?: '/usr'}/bin:${PATH}"
        DOCKER_BUILDKIT = '1'
        MAVEN_OPTS = "-Dmaven.repo.local=${WORKSPACE}/.m2"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from repository"
                checkout scm
            }
        }

        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        sh '''
                            cd backend || exit 1

                            # Build shared module first
                            cd shared && ../mvnw clean install -DskipTests && cd ..

                            # Run tests for each service (pipeline fails if any test fails)
                            cd services/user && ../../mvnw test && cd ../..
                            cd services/product && ../../mvnw test && cd ../..
                            cd services/media && ../../mvnw test && cd ../..
                            cd services/eureka && ../../mvnw test && cd ../..
                            cd api-gateway && ../mvnw test
                        '''
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        sh '''
                            echo "Running frontend tests..."
                            cd frontend
                            npm ci
                            npm run test
                        '''
                    }
                }
            }
        }

        stage('SonarQube Health Check') {
            steps {
                sh '''
                    echo "Checking SonarQube availability..."
                    SONAR_URL="http://host.docker.internal:9000"
                    
                    # Check if SonarQube is available (using unauthenticated endpoint)
                    STATUS=$(curl -f -s "$SONAR_URL/api/system/status" | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "UNREACHABLE")
                    
                    if [ "$STATUS" != "UP" ]; then
                        echo "⚠️  SonarQube is not available. Status: $STATUS"
                        echo "Please start SonarQube: cd sonarqube && docker-compose up -d"
                        exit 1
                    fi
                    
                    echo "✅ SonarQube is UP and ready"
                    
                    # Pre-create Maven local repository to avoid parallel race conditions
                    echo "Initializing Maven repository at ${WORKSPACE}/.m2"
                    mkdir -p "${WORKSPACE}/.m2/repository"
                '''
            }
        }

        stage('User Service Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('backend/services/user') {
                            sh '''
                                echo "Analyzing User Service..."
                                ../../mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                    -Dsonar.projectKey=e-com-user-service \
                                    -Dsonar.projectName="User Service" \
                                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('Product Service Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('backend/services/product') {
                            sh '''
                                echo "Analyzing Product Service..."
                                ../../mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                    -Dsonar.projectKey=e-com-product-service \
                                    -Dsonar.projectName="Product Service" \
                                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('Media Service Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('backend/services/media') {
                            sh '''
                                echo "Analyzing Media Service..."
                                ../../mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                    -Dsonar.projectKey=e-com-media-service \
                                    -Dsonar.projectName="Media Service" \
                                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('Eureka Service Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('backend/services/eureka') {
                            sh '''
                                echo "Analyzing Eureka Service..."
                                ../../mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                    -Dsonar.projectKey=e-com-eureka-service \
                                    -Dsonar.projectName="Eureka Service" \
                                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('API Gateway Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('backend/api-gateway') {
                            sh '''
                                echo "Analyzing API Gateway..."
                                ../mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                    -Dsonar.projectKey=e-com-api-gateway \
                                    -Dsonar.projectName="API Gateway" \
                                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('SonarQube Frontend Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        dir('frontend') {
                            sh '''
                                echo "Analyzing Frontend (Angular)..."
                                
                                # Use npx to run sonar-scanner without global install
                                npx sonarqube-scanner \
                                    -Dsonar.projectKey=e-com-frontend \
                                    -Dsonar.projectName="E-commerce Frontend" \
                                    -Dsonar.sources=src \
                                    -Dsonar.tests=src \
                                    -Dsonar.test.inclusions="**/*.spec.ts" \
                                    -Dsonar.exclusions="**/node_modules/**,**/*.spec.ts,**/coverage/**" \
                                    -Dsonar.javascript.lcov.reportPaths=coverage/e-com/lcov.info \
                                    -Dsonar.typescript.lcov.reportPaths=coverage/e-com/lcov.info \
                                    -Dsonar.host.url=http://host.docker.internal:9000
                            '''
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    echo "Waiting for SonarQube Quality Gate result..."
                    echo "Enforcing quality on Frontend (customer-facing application)"
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "❌ Quality Gate failed: ${qg.status}\n" +
                                  "Please check SonarQube dashboard at http://localhost:9000 for details."
                        } else {
                            echo "✅ Quality Gate passed successfully!"
                        }
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
                script {
                    // Initialize or increment deployment version
                    sh '''
                        mkdir -p .deployment-state
                        
                        if [ -f .deployment-state/current-version.txt ]; then
                            CURRENT_VERSION=$(cat .deployment-state/current-version.txt)
                        else
                            CURRENT_VERSION=0
                        fi
                        
                        NEXT_VERSION=$((CURRENT_VERSION + 1))
                        echo $NEXT_VERSION > .deployment-state/next-version.txt
                        echo $CURRENT_VERSION > .deployment-state/previous-version.txt
                        
                        echo "Deploying v$NEXT_VERSION (current: v$CURRENT_VERSION)"
                    '''

                    // Deploy new version with versioned containers
                    sh '''
                        DEPLOY_VERSION=$(cat .deployment-state/next-version.txt)
                        PREVIOUS_VERSION=$(cat .deployment-state/previous-version.txt)
                        export DEPLOY_VERSION
                        
                        # Remove any existing containers with the new version number (from failed previous attempts)
                        docker ps -a --filter "name=ecom-.*-${DEPLOY_VERSION}" --format "{{.Names}}" | xargs -r docker rm -f || true
                        
                        # Start stateful services (MongoDB, Kafka) first if not running
                        # These are singletons (no versioning) and persist across deployments
                        docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d mongodb kafka
                        sleep 5
                        
                        # Deploy versioned application services
                        # Old version stays running until new version is healthy
                        docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d
                        sleep 30
                        docker-compose -f docker-compose.yml -f docker-compose.ci.yml ps

                        UNHEALTHY=$(docker ps --filter "name=ecom-.*-${DEPLOY_VERSION}" --filter "health=unhealthy" --format "{{.Names}}" || true)
                        if [ -n "$UNHEALTHY" ]; then
                            echo "ERROR: Unhealthy services in v$DEPLOY_VERSION: $UNHEALTHY"
                            exit 1
                        fi

                        echo "v$DEPLOY_VERSION deployed successfully"
                        
                        if [ "$PREVIOUS_VERSION" != "0" ]; then
                            docker ps -a --filter "name=ecom-.*-${PREVIOUS_VERSION}" --format "{{.Names}}" | xargs -r docker rm -f || true
                            echo "Removed v$PREVIOUS_VERSION containers"
                        fi
                        
                        echo $DEPLOY_VERSION > .deployment-state/current-version.txt
                    '''
                }
            }
            post {
                failure {
                    script {
                        echo "Deployment failed - initiating rollback"
                        sh '''
                            FAILED_VERSION=$(cat .deployment-state/next-version.txt 2>/dev/null || echo "unknown")
                            PREVIOUS_VERSION=$(cat .deployment-state/previous-version.txt 2>/dev/null || echo "0")
                            
                            echo "Rolling back: v$FAILED_VERSION -> v$PREVIOUS_VERSION"
                            
                            if [ "$FAILED_VERSION" != "unknown" ]; then
                                docker ps -a --filter "name=ecom-.*-${FAILED_VERSION}" --format "{{.Names}}" | xargs -r docker rm -f || true
                            fi
                            
                            if [ "$PREVIOUS_VERSION" != "0" ]; then
                                OLD_CONTAINERS=$(docker ps --filter "name=ecom-.*-${PREVIOUS_VERSION}" --format "{{.Names}}" | wc -l)
                                if [ "$OLD_CONTAINERS" -gt 0 ]; then
                                    echo "v$PREVIOUS_VERSION still running - no downtime"
                                    docker ps --filter "name=ecom-.*-${PREVIOUS_VERSION}" --format "table {{.Names}}\t{{.Status}}"
                                else
                                    export DEPLOY_VERSION=$PREVIOUS_VERSION
                                    docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d || {
                                        echo "ERROR: Could not restore v$PREVIOUS_VERSION"
                                        exit 1
                                    }
                                    sleep 15
                                    echo "v$PREVIOUS_VERSION restored"
                                fi
                            else
                                echo "No previous version available (first deployment)"
                            fi
                            
                            echo "Rollback complete - running v$PREVIOUS_VERSION"
                        '''
                    }
                }
                success {
                    script {
                        sh '''
                            echo "BUILD_NUMBER=${BUILD_NUMBER}" > .deployment-state/last-successful.txt
                            echo "GIT_COMMIT=${GIT_COMMIT}" >> .deployment-state/last-successful.txt
                            echo "TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .deployment-state/last-successful.txt
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Build completed: ${currentBuild.currentResult}"

                // Get commit message before cleaning workspace
                def commitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                env.COMMIT_MESSAGE = commitMessage

                // Report status to GitHub (for PRs and commits)
                def buildState = currentBuild.currentResult?.toLowerCase() ?: 'success'
                def ghState = (buildState == 'success') ? 'success' : 'failure'
                
                if (env.GIT_COMMIT) {
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        sh """
                            set +e
                            
                            # Report Jenkins build status
                            curl -s -H "Authorization: token \${GITHUB_TOKEN}" \\
                                -X POST -H "Accept: application/vnd.github.v3+json" \\
                                -d '{"state":"${ghState}", "context":"Jenkins", "description":"Build ${buildState}", "target_url":"${BUILD_URL}"}' \\
                                https://api.github.com/repos/Toft08/e-com/statuses/\${GIT_COMMIT} || true
                            
                            # Report SonarQube quality gate status
                            curl -s -H "Authorization: token \${GITHUB_TOKEN}" \\
                                -X POST -H "Accept: application/vnd.github.v3+json" \\
                                -d '{"state":"${ghState}", "context":"SonarQube quality gate check", "description":"Quality gate ${buildState}"}' \\
                                https://api.github.com/repos/Toft08/e-com/statuses/\${GIT_COMMIT} || true
                            
                            exit 0
                        """
                    }
                }

                // Archive test results (backend and frontend combined)
                junit allowEmptyResults: true, testResults: 'backend/**/target/surefire-reports/*.xml, frontend/test-results/*.xml'

                // Archive test artifacts for download
                archiveArtifacts artifacts: 'backend/**/target/surefire-reports/*.xml', allowEmptyArchive: true
                archiveArtifacts artifacts: 'frontend/test-results/*.xml', allowEmptyArchive: true

                // Cleanup Docker resources
                sh '''
                    docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "ecom-|e-commerce" | tail -n +6 | xargs -r docker rmi || true
                    docker image prune -f || true
                '''

                // Cleanup workspace (done last, after getting commit message)
                if (env.WORKSPACE) {
                    cleanWs notFailBuild: true
                } else {
                    echo "No workspace available; skipping cleanWs"
                }

                // Send email notification
                def buildStatus = currentBuild.currentResult
                def emailRecipients = env.EMAIL_RECIPIENTS ?: 'toft.dah@gmail.com'
                def recipientList = emailRecipients.split(',').collect { it.trim() }

                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : '❌'
                def statusText = buildStatus == 'SUCCESS' ? 'succeeded' : 'failed'

                def emailSubject = "${statusEmoji} Build ${buildStatus.capitalize()}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"

                def emailBody = """
                    <h3>Build ${statusText}!</h3>
                    <p><strong>Project:</strong> ${env.JOB_NAME}<br>
                    <strong>Build Number:</strong> #${env.BUILD_NUMBER}<br>
                    <strong>Commit:</strong> ${env.COMMIT_MESSAGE}<br>
                    <strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    ${buildStatus == 'SUCCESS' ? '' : '<p><em>Please check the build logs for details.</em></p>'}
                """

                emailext (
                    subject: emailSubject,
                    body: emailBody,
                    to: recipientList.join(','),
                    mimeType: 'text/html'
                )
            }
        }
    }
}
