pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('List Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                docker build -t demo-jenkins-login .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f demo-jenkins-login-container || true

                docker run -d \
                  -p 3000:80 \
                  --name demo-jenkins-login-container \
                  demo-jenkins-login
                '''
            }
        }
    }
}