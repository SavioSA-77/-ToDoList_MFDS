FROM nginx:alpine

# Remove o index padrão do Nginx
RUN rm /usr/share/nginx/html/index.html

# Copia os arquivos do frontend
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
