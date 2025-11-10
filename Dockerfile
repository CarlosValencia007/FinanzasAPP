# Dockerfile para FinanzApp - Vue + Vite
# Optimizado para Google Cloud Run

# Etapa 1: Build
FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:alpine

# Crea la configuración de Nginx para SPA
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Copia los archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run usa el puerto 8080 por defecto
EXPOSE 8080

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]