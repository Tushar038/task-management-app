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
        sh 'docker build -t tusharnagar/task-backend:latest ./backend'
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh 'docker build -t tusharnagar/task-frontend:latest ./frontend'
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Push Images') {
      steps {
        sh 'docker push tusharnagar/task-backend:latest'
        sh 'docker push tusharnagar/task-frontend:latest'
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
