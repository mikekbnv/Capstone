# FROM node:14

# WORKDIR /app

# # RUN npm install

# COPY . .

# # RUN npm run build

# EXPOSE 3000

# #CMD ["npm", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]

# make from nginx
FROM nginx:latest

COPY build/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

