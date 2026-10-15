
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        APP_NAME = 'projectsuchit-frontend'
        IMAGE_NAME = 'projectsuchit-frontend'
        APP_PORT = '8081'
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('Check Environment') {
            steps {
                sh '''
                    set -e
                    node --version
                    npm --version
                    docker --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    set -e
                    test -f package-lock.json
                    npm ci
                '''
            }
        }

        stage('Build Vue Application') {
            steps {
                sh '''
                    set -e
                    npm run build
                    test -f dist/index.html
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -e
                    docker build \
                      -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                      -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    set -e

                    # Start the new image before removing the old container.
                    # It uses a temporary localhost port for validation.
                    docker rm -f ${APP_NAME}-candidate 2>/dev/null || true

                    docker run -d \
                      --name ${APP_NAME}-candidate \
                      -p 127.0.0.1:8082:80 \
                      ${IMAGE_NAME}:${BUILD_NUMBER}

                    # Verify that the new container responds
                    for i in $(seq 1 15); do
                      if curl -fsS http://127.0.0.1:8082/ >/dev/null; then
                        break
                      fi
                      sleep 2
                    done

                    curl -fsS http://127.0.0.1:8082/ >/dev/null

                    # Replace the previous container
                    docker rm -f ${APP_NAME} 2>/dev/null || true
                    docker rm -f ${APP_NAME}-candidate

                    docker run -d \
                      --restart unless-stopped \
                      --name ${APP_NAME} \
                      -p 127.0.0.1:${APP_PORT}:80 \
                      ${IMAGE_NAME}:${BUILD_NUMBER}

                    # Verify production port
                    for i in $(seq 1 15); do
                      if curl -fsS http://127.0.0.1:${APP_PORT}/ >/dev/null; then
                        exit 0
                      fi
                      sleep 2
                    done

                    echo "Deployment health check failed"
                    docker logs ${APP_NAME}
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Vue application deployed to Docker on EC2.'
        }

        failure {
            echo 'FAILED: Check the stage logs in Jenkins Console Output.'
        }

        always {
            echo 'Pipeline completed.'
        }
    }
}
