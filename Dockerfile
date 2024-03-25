FROM node

WORKDIR /app

COPY . .

RUN npm i bcryptjs

EXPOSE 3000

CMD ["node","server"]