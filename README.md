# auction-authentication-service

1. Generate Backend Docker Image
   docker build -t backend_api:v1 .
2. Run Docker Compose file
   docker-compose -d up
3. Test API Health
   API ENDPOINT:[http://localhost/api/health](http://localhost/api/health)
4. Stop Project
   docker-compose down

K8S Deployment 


docker run --rm -p 3000:3000 backend_api:v1

kubectl delete all --all

kubectl logs -l app=backend-api --all-containers

kubectl apply -f mongo-deployment.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-hpa.yaml

kubectl rollout restart deployment backend-api
