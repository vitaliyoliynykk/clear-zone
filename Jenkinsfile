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

        stage('SonarQube analysis') {
      steps {
        script { // Індикація того що подальший блок коду буде використовувати scripted pipeline
          def scannerHome = tool 'SonarQube Scanner' // в оголошену змінну запишеться шлях до
          // утиліти sonar - scanner, який унаслідується з Global Tool Configuration
          withSonarQubeEnv('SonarQube') { // Вказуємо який SonarQube Server використовувати,
            //  назва повинна бути така ж як і в Configure System
            sh "${scannerHome}/bin/sonar-scanner" // Переходимо у корінь
          // папки проекту, та запускаємо утиліту сканер
          }
        }
        7
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
