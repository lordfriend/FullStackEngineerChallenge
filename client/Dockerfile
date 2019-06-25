FROM node:12

RUN npm install -g @angular/cli@8.0.3

RUN mkdir -p /app

WORKDIR /app

COPY ./ .

RUN mv proxy-docker.conf.json proxy.conf.json

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
