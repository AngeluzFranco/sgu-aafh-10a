pipeline {
    agent any

    stages {
        // Parar los servicios que ya existen o en todo caso hacer caso omiso
        stage('Parando los servicios...') {
            steps {
                bat '''
                    docker compose -f docker-compose.ci.yml -p sgu-aafh-10a-ci down || echo "No hay servicios ejecutandose"
                '''
            }
        }

        // Eliminar las imágenes creadas por ese proyecto
        stage('Eliminando imágenes anteriores...') {
            steps {
                bat '''
                    docker images --filter "reference=*sgu-ci*" -q | xargs -r docker rmi -f || echo "No hay imagenes CI por eliminar"
                    docker images --filter "reference=client:1.0-sgu-ci" -q | xargs -r docker rmi -f || echo "No hay imagen frontend CI"
                    docker images --filter "reference=server:1.0-sgu-ci" -q | xargs -r docker rmi -f || echo "No hay imagen backend CI"
                '''
            }
        }

        // Del recurso SCM configurado en el job, jala el repo
        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        // Construir y levantar los servicios
        stage('Construyendo y desplegando servicios...') {
            steps {
                bat '''
                    echo "Iniciando build de servicios..."
                    docker compose -f docker-compose.ci.yml -p sgu-aafh-10a-ci up --build -d
                    echo "Verificando estado de servicios..."
                    docker compose -f docker-compose.ci.yml -p sgu-aafh-10a-ci ps
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }

        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'Pipeline finalizado'
        }
    }
}

