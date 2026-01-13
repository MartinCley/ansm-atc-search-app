# Options de Registry pour déploiement Cleyrop

## 🐳 Option 1: Docker Hub (Recommandé pour production)

```bash
# 1. Créer un compte Docker Hub si besoin
# 2. Se connecter
docker login

# 3. Tagger et pousser
docker tag windsurf-project-ansm-app:latest votre-username/ansm-atc-search:latest
docker push votre-username/ansm-atc-search:latest

# 4. Mettre à jour values.yaml
image:
  repository: votre-username/ansm-atc-search
```

## 🐙 Option 2: GitHub Container Registry

```bash
# 1. Créer un token GitHub avec permissions packages:write
# 2. Se connecter
echo "votre-token" | docker login ghcr.io -u votre-username --password-stdin

# 3. Tagger et pousser
docker tag windsurf-project-ansm-app:latest ghcr.io/votre-username/ansm-atc-search:latest
docker push ghcr.io/votre-username/ansm-atc-search:latest

# 4. Mettre à jour values.yaml
image:
  repository: ghcr.io/votre-username/ansm-atc-search
```

## 🏢 Option 3: Registry Cleyrop (Si disponible)

```bash
# 1. Obtenir les credentials du registry Cleyrop
# 2. Se connecter
docker login registry.cleyrop.net

# 3. Tagger et pousser
docker tag windsurf-project-ansm-app:latest registry.cleyrop.net/ansm-atc-search:latest
docker push registry.cleyrop.net/ansm-atc-search:latest

# 4. Mettre à jour values.yaml
image:
  repository: registry.cleyrop.net/ansm-atc-search
```

## 📋 Étapes pour Cleyrop

1. **Choisir un registry** (Docker Hub recommandé)
2. **Pousser l'image** sur le registry choisi
3. **Mettre à jour values.yaml** avec le bon repository
4. **Déployer avec Helm** sur Cleyrop

## 🔧 Vérification

```bash
# Vérifier que l'image est accessible
docker pull votre-username/ansm-atc-search:latest

# Tester localement avec Helm
helm install test ./helm --set image.repository=votre-username/ansm-atc-search
```
