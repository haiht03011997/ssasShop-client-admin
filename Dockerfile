# Stage 1: Build React App
FROM node:16-alpine AS build
WORKDIR /app

# Chỉ copy các file cần thiết để cài đặt dependency trước
COPY package.json package-lock.json ./
RUN npm install

# Copy phần mã nguồn sau để chỉ build lại khi mã nguồn thay đổi
COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.21-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
