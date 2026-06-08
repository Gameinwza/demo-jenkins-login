pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t demo-login .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop demo-login || true
                docker rm demo-login || true

                docker run -d \
                  --name demo-login \
                  -p 8080:80 \
                  demo-login
                '''
            }
        }
    }
}
