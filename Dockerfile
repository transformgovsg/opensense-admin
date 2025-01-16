ARG REPO_URL
FROM ${REPO_URL}node:20-bookworm

WORKDIR /admin

ENV NODE_ENV="production"

RUN apt-get update && apt-get upgrade -y

COPY package.json ./
COPY package-lock.json ./
COPY patches patches
RUN npm i -g typescript husky

RUN npm install --include dev
COPY . .

RUN npm run zenstack:generate
RUN npm run build
RUN rm -rf src

CMD npm start
