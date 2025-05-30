FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf # Uporabi zgornji nginx.conf

EXPOSE 8080 
CMD ["nginx", "-g", "daemon off;"]
