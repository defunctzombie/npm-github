FROM node:0.10.38
MAINTAINER Roman Shtylman <shtylman@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 8000
ENTRYPOINT ["bin/registry"]

ADD package.json /usr/src/app/
RUN npm install --production

ADD . /usr/src/app
