FROM node:22-alpine AS frontend
WORKDIR /workspace/frontend
COPY delicias-cafe/package*.json ./
RUN npm ci
COPY delicias-cafe/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /workspace
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY *.sql backend/src/main/resources/db/manual/
COPY --from=frontend /workspace/frontend/dist/delicias-cafe/browser backend/src/main/resources/static
RUN mvn -B -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /workspace/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=10000
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
