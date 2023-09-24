FROM node:18-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN ng build

FROM nginx:bullseye
COPY --from=build /app/dist/post-layout-web-app/ /usr/share/nginx/html
EXPOSE 80
