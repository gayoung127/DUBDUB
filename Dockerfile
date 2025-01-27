
FROM gradle:7.6.1-jdk17 AS builder

WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
RUN ./gradlew build -x test --no-daemon || true

COPY . .

RUN ./dubdub/gradlew clean build -x test --no-daemon

FROM eclipse-temurin:17-jre-alpine

ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar /app/dubdub_app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/dubdub_app.jar"]
