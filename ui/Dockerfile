FROM node:20
WORKDIR ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
