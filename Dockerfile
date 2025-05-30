# Stage 1: Build the React application
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./

ENV NODE_OPTIONS=--max_old_space_size=4096

RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx and HTTPS (with self-generated certificates)
FROM nginx:alpine

# Build argument to specify the hostname for the certificate
ARG CERT_HOSTNAME=localhost

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/ssl && \
    apk add --no-cache openssl && \
    echo "Generating self-signed certificate for ${CERT_HOSTNAME}..." && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/server.key \
      -out /etc/nginx/ssl/server.crt \
      -subj "/CN=${CERT_HOSTNAME}" \
      -addext "subjectAltName = DNS:${CERT_HOSTNAME},IP:127.0.0.1" && \
    echo "Certificate generation complete."

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]