# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV development
RUN mkdir /app && chown node:node /app
RUN mkdir /app/node_modules && chown node:node /app/node_modules
RUN mkdir /app/dist && chown node:node /app/dist

# Setting up the work directory
WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./

# Installing dependencies
RUN npm install && npm cache clean --force

# Copying all the files in our project
COPY --chown=node:node . .

# Starting our application
CMD [ "npm", "run", "start:dev"]
