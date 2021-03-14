FROM node:10.13.0-alpine

ENV APP /app
RUN mkdir $APP
WORKDIR $APP

RUN apk update && \
  npm install -g npm && \
  npm install -g @vue/cli

# CMD ["/bin/sh"]
