# 산출물

### I. 기술 스택 & 개발 환경

---

> [사용 도구]
>
> - 이슈 관리: JIRA
> - 형상 관리: GitLab
> - 커뮤니케이션: Mattermost, Notion, Google Docs
> - 디자인: Figma
> - UCC: Movavi
> - CI/CD: EC2, Docker, Jenkins

> [개발 환경]
>
> - **Front-end**
>   - React: 19.0.0
>   - Next.js: 15.1.7
>   - Typescript: 2.0.4
>   - ESLint: 3
>   - Prettier: 3.5.1
>   - DaisyUI: 4.12.23
>   - PWA: 1.9.7
> - **Back-end**
>   - JDK: 17.0.3 (openjdk)
>   - SpringBoot: 3.4.1
>   - SpringSecurity
>   - Gradle: 8.11
>   - jjwt-api:0.12.3
>   - Swagger: 2.3.0
> - **DB**
>   - MySQL: 8.0.41
> - **Infra**
>   - Server:
>     - AWS EC2: Ubuntu 22.04.5 LTS
>   - Containerization Platform:
>     - Docker: 27.5.1
>   - CI/CD:
>     - Jenkins: 2.495
>   - Web Server:
>     - Nginx: 1.18.0 (Ubuntu)

> [외부 서비스]
>
> - OpenVidu
> - RabbitMQ
> - Redis
> - Kakao OAuth
> - CLOVA Speech API

> [gitignore]

```
[Front]

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
.env-fe

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

```
[Back]

HELP.md
.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache
bin/
!**/src/main/**/bin/
!**/src/test/**/bin/

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
out/
!**/src/main/**/out/
!**/src/test/**/out/

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/

### VS Code ###
.vscode/

### .env ###
*.env*

### .yml ###
!example.yml

# QueryDSL
/src/main/generated/

### 키 파일
**/keystore/**
```

> [환경변수]

```
[Front]
# jenkins에 .env-fe 파일로 정의

HOSTNAME=
PORT=

# Kakao OAuth 설정
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=
NEXT_PUBLIC_KAKAO_CLIENT_ID=
NEXT_PUBLIC_KAKAO_REDIRECT_URI=
NEXT_PUBLIC_BACKEND_URL=

# Clova API KEY
CLOVA_API_KEY=
CLOVA_API_URL=
```

```
[Back]
# 서버 설정
SERVER_PORT={백엔드 서버용 포트}

# DB 서버 연결 설정
DB_URL=jdbc:mariadb://{도메인}:{DB용 포트}/{DB 이름}
DB_USERNAME={DB 아이디}
DB_PASSWORD={DB 패스워드}

# MQTT 연결 설정
MQTT_BROKER_URL=tcp://{도메인}:{MQTT용 포트}

# DB 연결 설정
MYSQL_ENDPOINT=
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=

# JWT 설정
JWT_SECRET=
JWT_ACCESS_EXPIRATION=
JWT_REFRESH_EXPIRATION=

# 로그인 redirect URL
FRONTEND_LOGIN_URL=

# Kakao OAuth 설정
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_REDIRECT_URI=

# S3 설정
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=
S3_BUCKET_NAME=

# SSL 설정
SSL_KEYSTORE_PASSWORD=

# Openvidu 설정
OPENVIDU_LOCAL_URL=
OPENVIDU_PROD_URL=
OPENVIDU_SECRET=

# RabbitMQ 설정
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```

### II. 빌드 및 배포

---

> [개발 환경에서 직접 빌드(로컬 빌드)] > [Front]
>
> 1. 의존성 설치 `npm install`
> 2. 프로젝트 빌드 (정적 파일 생성) `npm run build`
>
> [Back]
>
> 1. 프로젝트 빌드 `./gradlew build` (Gradle - Tasks - build - bootJar 로도 jar
>    파일 생성 가능)
> 2. 빌드된 JAR 파일 실행 `java -jar build/libs/{프로젝트명}.jar`
>
> - 빌드/실행 동시에 하는 경우 `./gradlew bootRun`

> [배포 시 빌드(Jenkins 파이프라인)]

> jenkins 파이프라인 - Front

```
pipeline {
    agent any

    environment {
        REPO_URL = 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A801.git'
        BRANCH_NAME = 'client'
        CREDENTIALS_ID = 'gitlab-token'
        IMAGE_NAME = "nextjs-app"
        CONTAINER_NAME = "nextjs_app"
        DOCKER_COMPOSE_FILE = "docker-compose-fe.yml"
        ENV_CREDENTIALS_ID = "nextjs_env_file"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔍 ${BRANCH_NAME} 브랜치 체크아웃 중..."
                git branch: BRANCH_NAME, credentialsId: CREDENTIALS_ID, url: REPO_URL
            }
        }

        stage('Retrieve .env-fe') {
            steps {
                echo "📂 Jenkins Credentials에서 .env-fe 가져오는 중..."
                withCredentials([file(credentialsId: ENV_CREDENTIALS_ID, variable: 'ENV_FILE')]) {
                    sh "chmod 664 .env-fe"
                    sh "cp $ENV_FILE .env-fe"
                }
            }
        }

        stage('Stop & Remove Existing Containers') {
            steps {
                echo "🛑 기존 Docker 컨테이너 정리 중..."
                script {
                    def containerExists = sh(script: "docker ps -a -q -f name=${CONTAINER_NAME}", returnStdout: true).trim()
                    if (containerExists) {
                        echo "Removing existing container..."
                        sh "docker stop ${CONTAINER_NAME} || true"
                        sh "docker rm ${CONTAINER_NAME} || true"
                    } else {
                        echo "No existing container found."
                    }
                }
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                echo "🚀 Docker Compose를 이용한 빌드 및 배포..."
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build"
            }
        }
    }

    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good',
                message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/g54hbziitjyxpfuwcijqsxmzhy',
                channel: 'a801_private'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger',
                message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/g54hbziitjyxpfuwcijqsxmzhy',
                channel: 'a801_private'
                )
            }
        }
    }
}
```

> jenkins 파이프라인 - Backend

```
pipeline {
    agent any
    environment {
        ENV_FILE_PATH = "${WORKSPACE}/.env"
        KEYSTORE_FILE_PATH = "${WORKSPACE}/keystore/ssafy-web.p12"  // 배포 시 사용될 키스토어 경로
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'server',
                    url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A801.git',
                    credentialsId: 'gitlab-token'
            }
        }

        stage('Retrieve .env from Credentials') {
            steps {
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    sh 'chmod 664 $ENV_FILE_PATH'
                    sh 'cp $ENV_FILE $ENV_FILE_PATH'
                }
            }
        }

        stage('Docker Compose Down') {
            steps {
                sh 'docker-compose down || true'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                sh '''
                export $(cat .env | xargs)
                docker-compose up -d --build
                '''
            }
        }

    }
    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good',
                message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/g54hbziitjyxpfuwcijqsxmzhy',
                channel: 'a801_private'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger',
                message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/g54hbziitjyxpfuwcijqsxmzhy',
                channel: 'a801_private'
                )
            }
        }
    }
}

```

> Frontend Dockerfile

```
# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# 환경 변수 파일 설정
ENV DOTENV_CONFIG_PATH=/app/.env-fe

# Build the application, ESLint 검사 생략
RUN NEXT_PUBLIC_DISABLE_ESLINT=true npm run build

# Stage 2: Create a lightweight production image
FROM node:18-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "run", "start"]

```

> Frontend Docker compose

```
version: '3.8'

services:
  nextjs:
    container_name: nextjs_app
    build:
      context: .
      dockerfile: Dockerfile-fe
    ports:
      - "3000:3000"
    env_file:
      - .env-fe
    restart: always

```

> Backend Dockerfile

```
# ----------------------------
# 1단계: 빌드 스테이지
# ----------------------------
FROM gradle:7.6.1-jdk17 AS builder

# 작업 디렉토리
WORKDIR /app

# (1) Gradle 관련 주요 파일만 먼저 복사 (의존성 캐시 활용 목적)
COPY dubdub/build.gradle dubdub/settings.gradle dubdub/gradlew ./
COPY dubdub/gradle ./gradle

# gradlew 실행 권한 (리눅스 환경에서 필요)
RUN chmod +x gradlew

# 초기 빌드 (의존성 다운로드; 실패해도 캐시 효과를 위해 || true 사용)
RUN ./gradlew build -x test --no-daemon || true

# (2) 나머지 소스 복사
COPY dubdub/ ./

RUN chmod +x gradlew

# (3) 최종 빌드
RUN ./gradlew clean build -x test --no-daemon

# ----------------------------
# 2단계: 런타임 스테이지
# ----------------------------
FROM eclipse-temurin:17-jre-alpine

# TimeZone 설정
ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata

WORKDIR /app

# 빌드 산출물(JAR) 복사
COPY --from=builder /app/build/libs/*.jar /app/dubdub_app.jar

# 컨테이너에서 열 포트 (예: 8080)
EXPOSE 8080

# 컨테이너 실행 시 명령
ENTRYPOINT ["java", "-jar", "/app/dubdub_app.jar"]

```

> Backend Docker compose

```
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dubdub_app
    ports:
      - "8081:8081"
    volumes:
      - ./logs:/app/logs
      - /home/ubuntu/jenkins-data/workspace/server-branch-deploy/keystore:/app/keystore
    env_file:
      - .env   # Jenkins에서 복사된 .env 파일을 자동 로드
    environment:
      SPRING_PROFILES_ACTIVE: prod  # 배포 환경 적용
      REDIS_HOST: redis  # Redis 컨테이너의 이름
      REDIS_PORT: 6379
      RABBITMQ_HOST: rabbitmq
      RABBITMQ_PORT: 5672
      RABBITMQ_USERNAME: ${RABBITMQ_USERNAME}
      RABBITMQ_PASSWORD: ${RABBITMQ_PASSWORD}
    depends_on:
      - redis  # Redis 컨테이너가 먼저 실행됨
      - rabbitmq

  redis:
    image: redis:7-alpine
    container_name: dubdub_redis
    ports:
      - "6379:6379"  # 호스트와 동일한 포트 매핑
    command: redis-server --appendonly yes  # 영속성 활성화
    volumes:
      - redis_data:/data  # Redis 데이터 영속화
    restart: always

  rabbitmq:
    image: rabbitmq:3.13-management
    container_name: dubdub_rabbitmq
    ports:
      - "5672:5672"    # AMQP 프로토콜용
      - "15672:15672"  # 관리 UI용
      - "15674:15674"  # STOMP 웹소켓용
    command: >
      bash -c "rabbitmq-plugins enable rabbitmq_management rabbitmq_web_stomp &&
              rabbitmq-server"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER=${RABBITMQ_USERNAME}
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_PASSWORD}
    restart: always

volumes:
  redis_data:  # Redis 데이터를 저장하는 볼륨
  rabbitmq_data:

```

> [Nginx 설정파일]

```
# HTTPS 서버 설정
server {
    # NextJS 앱으로 라우팅
    location / {
		    client_max_body_size 500M;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /next-api/ {
		    client_max_body_size 500M;    # 클라이언트 요청 용량 제한을 500MB로 설정
		    proxy_pass http://localhost:3000;
		    proxy_set_header Host $host;
		    proxy_set_header X-Real-IP $remote_addr;
		    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		}

    # Spring Boot 앱으로 라우팅
    location /api {
		    client_max_body_size 500M; #클라이언트 전송 용량 변경
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket 설정
    location /api/ws-studio {
		    proxy_pass http://localhost:8081/ws-studio;
		    proxy_http_version 1.1;
		    proxy_set_header Upgrade $http_upgrade;
		    proxy_set_header Connection "upgrade";
		    proxy_set_header Host $host;
		}

		# RabbitMQ Management UI
    location /rabbitmq/ {
        proxy_pass http://localhost:15672/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SSL 설정
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/i12a801.p.ssafy.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/i12a801.p.ssafy.io/privkey.pem;
    server_name i12a801.p.ssafy.io;
}

# HTTP를 HTTPS로 리다이렉트
server {
    if ($host = i12a801.p.ssafy.io) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name i12a801.p.ssafy.io;
    return 404;
}
```
