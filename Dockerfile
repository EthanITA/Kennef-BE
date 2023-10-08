FROM node:18.16
COPY . /app
WORKDIR /app
RUN yarn install
RUN npm run build
EXPOSE 3000
WORKDIR /app/dist
CMD ["node", "app.js"]
