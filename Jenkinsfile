pipeline {
  agent any

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend Image') {
      steps {
        sh 'docker build -t task-backend ./backend'
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh 'docker build -t task-frontend ./frontend'
      }
    }

    stage('CI Success') {
      steps {
        echo '🎉 CI pipeline completed successfully'
      }
    }
  }

  post {
    success {
      echo '✅ Build successful'
    }
    failure {
      echo '❌ Build failed'
    }
  }
}
