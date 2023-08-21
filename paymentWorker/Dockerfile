FROM node:18
WORKDIR /usr/app
COPY . .
COPY .env .env
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm","start"]