# Docker ANSM ATC Search App

## Construction et déploiement de l'image Docker

### Prérequis
- Docker installé sur votre machine
- Docker Compose (optionnel)

### Construction de l'image

```bash
# Construire l'image Docker
docker build -t ansm-atc-search .

# Ou avec docker-compose
docker-compose build
```

### Lancement de l'application

#### Option 1: Docker simple
```bash
docker run -d \
  --name ansm-app \
  -p 8080:80 \
  ansm-atc-search
```

#### Option 2: Docker Compose (recommandé)
```bash
docker-compose up -d
```

### Accès à l'application

Une fois lancée, l'application sera accessible à:
- **URL**: http://localhost:8080
- **Port**: 8080

### Configuration de l'API

L'application utilise les variables d'environnement suivantes:

#### Variables par défaut
- `NODE_ENV`: production
- `REACT_APP_API_BASE_URL`: http://localhost:3000/api
- `REACT_APP_API_TOKEN`: black_cake_348230
- `REACT_APP_DATASET_ID`: 325a0803-600a-4de7-860f-19187a601777

#### Personnalisation
```bash
# Avec variables d'environnement personnalisées
docker run -d \
  --name ansm-app \
  -p 8080:80 \
  -e REACT_APP_API_TOKEN=votre_token \
  -e REACT_APP_DATASET_ID=votre_dataset_id \
  ansm-atc-search
```

### Architecture Docker

L'image utilise une approche multi-stage:

1. **Étape 1 (Build)**: Node.js Alpine
   - Installation des dépendances
   - Build de l'application React
   - Optimisation pour la production

2. **Étape 2 (Runtime)**: Nginx Alpine
   - Serveur web léger et sécurisé
   - Compression gzip activée
   - Headers de sécurité configurés

### Caractéristiques

- **Image optimisée**: Basée sur Alpine Linux (~50MB)
- **Sécurisée**: Headers de sécurité configurés
- **Performante**: Compression gzip et cache statique
- **Production-ready**: Build optimisé pour React

### Logs et monitoring

```bash
# Voir les logs
docker logs ansm-app

# Suivre les logs en temps réel
docker logs -f ansm-app

# Avec docker-compose
docker-compose logs -f ansm-app
```

### Arrêt et nettoyage

```bash
# Arrêter l'application
docker stop ansm-app

# Supprimer le conteneur
docker rm ansm-app

# Avec docker-compose
docker-compose down
```

### Déploiement en production

Pour un déploiement en production, considérez:

1. **Variables d'environnement sécurisées**
   ```bash
   # Utiliser Docker secrets ou un fichier .env
   docker-compose --env-file .env.production up -d
   ```

2. **Reverse proxy**
   - Configurer un reverse proxy (nginx, Apache, etc.)
   - HTTPS/TLS configuré
   - Rate limiting

3. **Monitoring**
   - Health checks configurés
   - Logs centralisés
   - Métriques de performance

### Dépannage

#### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :8080
   
   # Changer le port dans docker-compose.yml
   ports:
     - "9090:80"  # utiliser 9090 au lieu de 8080
   ```

2. **Build échoue**
   ```bash
   # Nettoyer et reconstruire
   docker system prune -f
   docker-compose build --no-cache
   ```

3. **Application inaccessible**
   ```bash
   # Vérifier si le conteneur tourne
   docker ps
   
   # Vérifier les logs d'erreurs
   docker logs ansm-app
   ```
