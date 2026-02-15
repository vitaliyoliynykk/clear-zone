pipeline {
  agent any

  tools {
    nodejs 'node-22'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: '*/test']], userRemoteConfigs: scm.userRemoteConfigs])
      }
    }

    stage('Install') {
      steps {
        sh '''
          set -e
          node -v
          corepack enable
          corepack prepare pnpm@latest --activate
          pnpm install --frozen-lockfile
        '''
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -e
          pnpm build
        '''
      }
    }
  }
}
