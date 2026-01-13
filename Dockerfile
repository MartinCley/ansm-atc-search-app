# Étape 1: Utiliser une image Node.js légère
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source de l'application
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2: Utiliser nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers build de l'application dans nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
