FROM nginx:alpine

# Remove o index.html padrão do Nginx
RUN rm /usr/share/nginx/html/index.html

# Copia seus arquivos para a pasta do Nginx
COPY pagina.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Nginx escuta na porta 80 por padrão
EXPOSE 80
