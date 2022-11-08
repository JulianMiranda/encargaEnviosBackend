FROM node:18.11 as build

WORKDIR /encarga
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18.11
WORKDIR /encarga
COPY package.json .
RUN npm install --only=production
COPY --from=build /encarga/dist ./dist
CMD npm run start:prod