FROM node:jod-bookworm
WORKDIR ./
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build --verbose
CMD ["npm", "run", "serve"]
