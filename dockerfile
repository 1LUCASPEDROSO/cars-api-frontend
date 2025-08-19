FROM nginx:latest

# Remove a configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia sua config personalizada
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build Angular para a pasta padrão do nginx
COPY dist/cars-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
