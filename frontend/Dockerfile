FROM node:14-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=build-stage /app/dist .

RUN npm install -g http-server

EXPOSE 8080

CMD ["http-server", "-P", "http://backend:3000", "."]
