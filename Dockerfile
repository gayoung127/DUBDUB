# ----------------------------
# 1단계: 빌드 스테이지
# ----------------------------
FROM gradle:7.6.1-jdk17 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# gradlew, build.gradle, settings.gradle, gradle 폴더를 먼저 복사
# (의존성 캐시를 활용하기 위함)
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# gradlew 실행 권한 부여 (Unix 계열에서 필요한 경우)
RUN chmod +x gradlew

# 초기 빌드(혹은 의존성 다운로드)
# 빌드시 혹시 실패하더라도 캐시를 활용할 수 있도록 || true 사용
RUN ./gradlew build -x test --no-daemon || true

# 이후 전체 소스 코드를 복사
COPY . .

# 최종 빌드 (테스트 제외 -x test)
RUN ./gradlew clean build -x test --no-daemon

# ----------------------------
# 2단계: 런타임 스테이지
# ----------------------------
FROM eclipse-temurin:17-jre-alpine

# 타임존 설정
ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata

# 작업 디렉토리
WORKDIR /app

# 빌드 스테이지에서 생성된 jar 파일을 복사
COPY --from=builder /app/build/libs/*.jar /app/dubdub_app.jar

# 컨테이너가 사용할 포트
EXPOSE 8080

# 컨테이너 시작 시 명령
ENTRYPOINT ["java", "-jar", "/app/dubdub_app.jar"]
