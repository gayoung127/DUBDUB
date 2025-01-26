version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dubdub_app
    ports:
      - "80:8080"
    volumes:
      - ./logs:/app/logs
    environment:
      SPRING_PROFILES_ACTIVE: dev
      RDS_ENDPOINT: ${RDS_ENDPOINT}
      RDS_DATABASE: ${RDS_DATABASE}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
    restart: always

