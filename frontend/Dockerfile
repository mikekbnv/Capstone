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

# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf
COPY ./nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY ./nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY ./dhparam.pem /etc/nginx/dhparam.pem

# RUN ufw allow 'Nginx Full'
# RUN ufw delete allow 'Nginx HTTP'


EXPOSE 80



ENTRYPOINT ["nginx", "-g", "daemon off;"]

