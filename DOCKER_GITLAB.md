# Docker and GitLab CI/CD Setup

This project includes Docker configuration for development and production, as well as GitLab CI/CD pipeline configuration.

## Docker Setup

### Development

To run the application in development mode using Docker:

\`\`\`bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the development environment
docker-compose down
\`\`\`

You can also use the provided script:

\`\`\`bash
./scripts/docker-dev.sh
\`\`\`

### Production

To build a production Docker image:

\`\`\`bash
docker build -t nextjs-app .
\`\`\`

To run the production Docker image:

\`\`\`bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com nextjs-app
\`\`\`

## GitLab CI/CD

This project includes a GitLab CI/CD pipeline configuration in `.gitlab-ci.yml`. The pipeline consists of the following stages:

1. **Test**: Runs linting and tests
2. **Build**: Builds and pushes a Docker image
3. **Deploy**: Deploys the application to staging or production environments

### Pipeline Variables

The following variables need to be set in GitLab CI/CD settings:

- `CI_REGISTRY`: GitLab Container Registry URL
- `CI_REGISTRY_USER`: GitLab Container Registry username
- `CI_REGISTRY_PASSWORD`: GitLab Container Registry password
- `KUBE_URL`: Kubernetes API URL
- `KUBE_TOKEN`: Kubernetes API token

### Environment Variables

The following environment variables are used in the application and should be set in Kubernetes secrets:

- `NEXT_PUBLIC_API_URL`: API URL
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket URL
- `NEXT_PUBLIC_MQTT_URL`: MQTT URL
- `NEXT_PUBLIC_MQTT_USERNAME`: MQTT username
- `NEXT_PUBLIC_MQTT_PASSWORD`: MQTT password

### Deployment

The pipeline automatically deploys to the staging environment when changes are pushed to the `develop` branch. Deployment to production is manual and triggered from the GitLab CI/CD interface when changes are pushed to the `main` branch.

## Kubernetes

Kubernetes configuration files are provided in the `k8s` directory:

- `deployment.yaml`: Deployment configuration
- `service.yaml`: Service configuration
- `ingress.yaml`: Ingress configuration
- `secrets.yaml`: Secrets template

To apply these configurations:

\`\`\`bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
\`\`\`

For secrets, you need to create a secrets file with base64-encoded values:

\`\`\`bash
# Encode values
NEXT_PUBLIC_API_URL_BASE64=$(echo -n "https://api.example.com" | base64)
NEXT_PUBLIC_WEBSOCKET_URL_BASE64=$(echo -n "wss://api.example.com" | base64)
NEXT_PUBLIC_MQTT_URL_BASE64=$(echo -n "mqtt://mqtt.example.com" | base64)
NEXT_PUBLIC_MQTT_USERNAME_BASE64=$(echo -n "user" | base64)
NEXT_PUBLIC_MQTT_PASSWORD_BASE64=$(echo -n "password" | base64)

# Create secrets file
cat k8s/secrets.yaml | \
  sed "s/\${NEXT_PUBLIC_API_URL_BASE64}/$NEXT_PUBLIC_API_URL_BASE64/g" | \
  sed "s/\${NEXT_PUBLIC_WEBSOCKET_URL_BASE64}/$NEXT_PUBLIC_WEBSOCKET_URL_BASE64/g" | \
  sed "s/\${NEXT_PUBLIC_MQTT_URL_BASE64}/$NEXT_PUBLIC_MQTT_URL_BASE64/g" | \
  sed "s/\${NEXT_PUBLIC_MQTT_USERNAME_BASE64}/$NEXT_PUBLIC_MQTT_USERNAME_BASE64/g" | \
  sed "s/\${NEXT_PUBLIC_MQTT_PASSWORD_BASE64}/$NEXT_PUBLIC_MQTT_PASSWORD_BASE64/g" > k8s/secrets-filled.yaml

# Apply secrets
kubectl apply -f k8s/secrets-filled.yaml
