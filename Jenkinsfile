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

    }
}