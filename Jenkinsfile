pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t demo-jenkins-login .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f demo-app || true

                docker run -d \
                  --name demo-app \
                  -p 3000:3000 \
                  demo-jenkins-login
                '''
            }
        }
    }
}