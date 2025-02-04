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

# 빌드 컨텍스트에서 .p12 파일 복사
COPY ssafy-web.p12 /app/keystore/ssafy-web.p12


# 빌드 산출물(JAR) 복사
COPY --from=builder /app/build/libs/*.jar /app/dubdub_app.jar

# 컨테이너에서 열 포트 (예: 8080)
EXPOSE 8080

# 컨테이너 실행 시 명령
ENTRYPOINT ["java", "-jar", "/app/dubdub_app.jar"]
