FROM nginx:latest

COPY build/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf

COPY ./nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY ./nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY ./dhparam.pem /etc/nginx/dhparam.pem
COPY ./snippets/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY ./snippets/self-signed.conf /etc/nginx/snippets/self-signed.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

