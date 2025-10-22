# Houses App Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker and Docker Compose (v2.0+)
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)
- Git

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/houses-app.git
cd houses-app
```

### 2. Configure Environment Variables

Copy the example environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your actual values:

#### Required Environment Variables

**Backend (.env)**:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate a strong random string)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Supabase service key

**Frontend (.env)**:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Local Development

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Manual Setup

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Database Setup

```bash
# Run migrations
psql $DATABASE_URL < database/migrations/0001_init.sql

# Seed data (optional)
psql $DATABASE_URL < database/seed-data.sql
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Integration Tests

```bash
# Run full stack tests with Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## Production Deployment

### 1. Build Docker Images

```bash
# Build all images
docker-compose build

# Or build individually
docker build -t houses-backend ./backend
docker build -t houses-frontend ./frontend
```

### 2. Database Migration

```bash
# Run migrations on production database
docker-compose run --rm backend npm run db:migrate
```

### 3. Deploy with Docker Compose

```bash
# Start production services
docker-compose up -d

# Check service health
docker-compose ps
```

### 4. Deploy to Cloud Providers

#### AWS ECS

1. Push images to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [your-ecr-uri]
docker tag houses-backend:latest [your-ecr-uri]/houses-backend:latest
docker push [your-ecr-uri]/houses-backend:latest
```

2. Update ECS task definitions and services

#### Google Cloud Run

```bash
# Deploy backend
gcloud run deploy houses-backend \
  --image gcr.io/[PROJECT-ID]/houses-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy houses-frontend \
  --image gcr.io/[PROJECT-ID]/houses-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n houses-app
```

### 5. Configure SSL/TLS

For production, use a reverse proxy like Nginx with Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Monitoring and Maintenance

### Health Checks

- Backend: `GET /health`
- Frontend: `GET /` (should return 200)

### Logging

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Database Backups

```bash
# Backup database
docker-compose exec postgres pg_dump -U houses_user houses_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker-compose exec -T postgres psql -U houses_user houses_db < backup.sql
```

### Performance Monitoring

1. **Application Performance**: Use Sentry (already integrated)
2. **Infrastructure**: Use cloud provider monitoring (CloudWatch, Stackdriver)
3. **Database**: Monitor query performance and connection pools

### Updates and Maintenance

```bash
# Update dependencies
cd backend && npm update
cd ../frontend && npm update

# Rebuild and redeploy
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify network connectivity

#### 2. Redis Connection Failed

- Check REDIS_URL
- Ensure Redis is running
- Check Redis memory usage

#### 3. Frontend Can't Connect to Backend

- Verify NEXT_PUBLIC_API_URL
- Check CORS settings
- Ensure backend is running

#### 4. WebSocket Connection Issues

- Check Socket.IO CORS configuration
- Verify firewall rules
- Check load balancer WebSocket support

### Debug Mode

Enable debug logging:
```bash
# Backend
LOG_LEVEL=debug npm run dev

# Frontend
DEBUG=* npm run dev
```

### Container Issues

```bash
# Check container logs
docker logs houses-app-backend-1

# Access container shell
docker exec -it houses-app-backend-1 sh

# Check container resources
docker stats
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Environment variable encryption
- [ ] Regular backups

## Performance Optimization

1. **Enable caching**: Redis is configured for caching
2. **Database indexes**: Already created in migrations
3. **Image optimization**: Next.js handles this automatically
4. **CDN**: Configure CloudFront or similar for static assets
5. **Compression**: Enabled in both backend and frontend

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing

Use Nginx or cloud load balancers to distribute traffic across instances.

## Support

For issues and questions:
1. Check the logs first
2. Review this documentation
3. Search existing GitHub issues
4. Create a new issue with detailed information