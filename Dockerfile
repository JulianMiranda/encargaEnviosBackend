FROM node:alpine AS development

WORKDIR /usr/src/encarga
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/encarga

COPY package*.json ./
RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/encarga/dist ./dist

CMD ["node","dist/main"]