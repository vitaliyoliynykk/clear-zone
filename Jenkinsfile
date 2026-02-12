pipeline {
    agent any
    stages {
        stage('Checkout') {
             steps { checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: scm.userRemoteConfigs]) }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
          set -e
          export NVM_DIR="$HOME/.nvm"
          . "$NVM_DIR/nvm.sh"
          nvm use

          corepack enable
          pnpm -v || corepack prepare pnpm@latest --activate

          pnpm install --frozen-lockfile
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