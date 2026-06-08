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
        stage('Build Docker') {
    steps {
        sh 'docker build -t demo-login .'
    }
}
        stage('Run Docker') {
    steps {
        sh 'docker run -d -p 8080:8080 --name demo-login demo-login'    
    }
}