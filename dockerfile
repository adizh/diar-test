FROM node:18-alpine

WORKDIR /opt/app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4173
RUN npm run build
RUN ls -a

CMD ["npm", "run", "preview"]
