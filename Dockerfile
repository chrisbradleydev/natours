FROM node:14.19.1-alpine3.15

EXPOSE 3000

WORKDIR /var/www/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node_modules/.bin/nodemon", "server"]
