FROM node:16.15.1-alpine

WORKDIR /frontend_app

COPY package.json /frontend_app/ 
RUN npm install 

COPY . /frontend_app/    

EXPOSE 3000

