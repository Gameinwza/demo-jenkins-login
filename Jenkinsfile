pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t demo-jenkins-login:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    docker rm -f demo-app || true

                    docker run -d \
                        --name demo-app \
                        -p 3000:3000 \
                        demo-jenkins-login:latest
                '''
            }
        }
    }

    post {

        success {
            sh """
                curl -X POST \
                http://host.docker.internal:5678/webhook/jenkins-finished \
                -H "Content-Type: application/json" \
                -d '{
                    "project":"demo-login",
                    "status":"SUCCESS",
                    "build":"${BUILD_NUMBER}",
                    "job":"${JOB_NAME}"
                }'
            """
        }

        failure {
            sh """
                curl -X POST \
                http://host.docker.internal:5678/webhook/jenkins-finished \
                -H "Content-Type: application/json" \
                -d '{
                    "project":"demo-login",
                    "status":"FAILED",
                    "build":"${BUILD_NUMBER}",
                    "job":"${JOB_NAME}"
                }'
            """
        }
    }
}