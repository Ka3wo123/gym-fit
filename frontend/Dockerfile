FROM node:20.17.0-alpine AS build

WORKDIR /gym-fit/webapp

COPY package.json yarn*.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /gym-fit/webapp/dist/frontend/browser/ /usr/share/nginx/html
COPY --from=build /gym-fit/webapp/docker/nginx.conf /etc/nginx/conf.d/default.conf
