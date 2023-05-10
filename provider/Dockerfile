FROM node:14-alpine AS base
FROM pactfoundation/pact-cli:latest as pact

WORKDIR /app

COPY package*.json ./

FROM base AS publish

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]