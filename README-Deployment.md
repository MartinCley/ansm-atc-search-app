# Déploiement ANSM ATC Search sur Cleyrop

## 🚨 Problème de scheduling Kubernetes

L'erreur `7 node(s) didn't match Pod's node affinity/selector` indique que votre Helm chart a des contraintes de node qui ne correspondent à aucun node disponible dans le cluster Cleyrop.

## ✅ Solutions

### Solution 1: Utiliser le Helm chart fourni

1. **Utiliser le Helm chart simplifié** dans le dossier `helm/`
2. **Modifier le values.yaml** si nécessaire pour Cleyrop
3. **Déployer avec** :
   ```bash
   helm install ansm-app ./helm --namespace analyse-rubrique-4-6-des-rcps
   ```

### Solution 2: Pousser l'image sur Docker Hub

1. **Se connecter à Docker Hub** :
   ```bash
   docker login
   ```

2. **Pousser l'image** :
   ```bash
   docker push martinhamelle/ansm-atc-search:latest
   ```

3. **Mettre à jour values.yaml** :
   ```yaml
   image:
     repository: martinhamelle/ansm-atc-search
     tag: "latest"
   ```

### Solution 3: Utiliser le registry de Cleyrop

Si Cleyrop a son propre registry :

1. **Taguer l'image** pour le registry Cleyrop
2. **Pousser vers le registry Cleyrop**
3. **Mettre à jour l'image dans values.yaml**

## 🔧 Configuration Helm

### values.yaml modifié pour Cleyrop

```yaml
replicaCount: 1

image:
  repository: martinhamelle/ansm-atc-search  # Ou registry-cleyrop/ansm-atc-search
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  hosts:
    - host: analyse-rubrique-4-6-des-rcps.cleyrop.net  # Adapter au domaine Cleyrop
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

# IMPORTANT: Pas de nodeSelector, affinity ou tolerations
nodeSelector: {}
tolerations: []
affinity: {}
```

## 🚀 Déploiement étape par étape

### 1. Préparer l'image

```bash
# Option A: Docker Hub
docker push martinhamelle/ansm-atc-search:latest

# Option B: Registry Cleyrop (adapter les commandes)
docker tag windsurf-project-ansm-app:latest registry.cleyrop.net/ansm-atc-search:latest
docker push registry.cleyrop.net/ansm-atc-search:latest
```

### 2. Déployer sur Cleyrop

```bash
# Créer le namespace (déjà fait par Cleyrop)
kubectl create namespace analyse-rubrique-4-6-des-rcps

# Déployer avec Helm
helm install ansm-app ./helm \
  --namespace analyse-rubrique-4-6-des-rcps \
  --set image.repository=votre-registry/ansm-atc-search \
  --set ingress.hosts[0].host=votre-domaine.cleyrop.net
```

### 3. Vérifier le déploiement

```bash
kubectl get pods -n analyse-rubrique-4-6-des-rcps
kubectl get services -n analyse-rubrique-4-6-des-rcps
kubectl get ingress -n analyse-rubrique-4-6-des-rcps
```

## 🐛 Dépannage

### Si le pod ne démarre toujours pas :

1. **Vérifier les logs** :
   ```bash
   kubectl logs -n analyse-rubrique-4-6-des-rcps deployment/ansm-app
   ```

2. **Vérifier les events** :
   ```bash
   kubectl get events -n analyse-rubrique-4-6-des-rcps --sort-by=.metadata.creationTimestamp
   ```

3. **Vérifier les ressources** :
   ```bash
   kubectl describe node  # Voir les resources disponibles
   kubectl top nodes     # Voir l'utilisation actuelle
   ```

### Si l'image ne peut pas être pullée :

1. **Vérifier l'accès au registry**
2. **Créer un secret pour le registry** :
   ```bash
   kubectl create secret docker-registry registry-secret \
     --docker-server=votre-registry \
     --docker-username=votre-username \
     --docker-password=votre-password \
     --namespace analyse-rubrique-4-6-des-rcps
   ```

3. **Ajouter le secret au deployment** :
   ```yaml
   spec:
     template:
       spec:
         imagePullSecrets:
         - name: registry-secret
   ```

## 📋 Checklist avant déploiement

- [ ] Image poussée sur un registry accessible
- [ ] Helm chart sans nodeSelector/affinity restrictifs
- [ ] Resources CPU/Memory adaptées au cluster Cleyrop
- [ ] Ingress configuré avec le bon domaine
- [ ] Namespace créé (déjà fait par Cleyrop)
- [ ] Secrets pour le registry si nécessaire

## 🎯 Résultat attendu

Une fois déployé, votre application sera accessible via :
- **URL**: `https://analyse-rubrique-4-6-des-rcps.cleyrop.net`
- **Fonctionnalités**: Recherche ATC complète avec sections 4.6
