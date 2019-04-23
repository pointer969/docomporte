FROM node:carbon

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/driveon/

WORKDIR $HOME/driveon

RUN npm i

COPY . $HOME/driveon

EXPOSE 4884

CMD ["npm", "start"]
