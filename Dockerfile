FROM nginx:alpine

# Copia os arquivos (com os nomes corretos do seu projeto)
COPY pagina.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
