pipeline {
    agent any
    stages {
        stage('Checkout') {
             steps { checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: scm.userRemoteConfigs]) }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                nvm use
                pnpm install
                '''
            }
        }

        stage('Build Project') {
            steps {
                sh 'pnpm build'
            }
        }
    }
}