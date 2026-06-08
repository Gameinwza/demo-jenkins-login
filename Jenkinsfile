pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello Jenkins'
            }
        }

        stage('List Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker version'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t demo-login .'
            }
        }

        stage('Run Docker') {
            steps {
                sh '''
                docker rm -f demo-login || true
                docker run -d -p 8080:80 --name demo-login demo-login
                '''
            }
        }

        stage('Check Tools') {
            steps {
                sh 'git --version'
            }
        }
    }
}