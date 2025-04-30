FROM node:22-alpine3.19

ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID


ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

WORKDIR /usr/src/app

COPY package.json .

RUN npm install
RUN npm i -g serve

COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]