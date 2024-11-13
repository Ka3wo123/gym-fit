FROM node:20.17.0-alpine

WORKDIR /gym-fit/backend

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]
