# 🌟 Vibe Check App

A specialized social interaction coaching application designed to help neurodivergent users navigate first-time social interactions including dates, interviews, networking, and casual events.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if running database locally)
- Redis (if running locally)

### Development Setup

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd houses-app
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start development environment:**
   ```bash
   # Start database and Redis
   ./scripts/dev-setup.sh
   
   # In separate terminals:
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Deploy with Docker:**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Access the application:**
   - Application: http://localhost (via Nginx)
   - Direct Frontend: http://localhost:3000
   - Direct Backend: http://localhost:3001

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Supabase integration
- **Caching:** Redis for session management
- **Real-time:** Socket.IO for live coaching support
- **Security:** Helmet, CORS, rate limiting

### Frontend (`/frontend`)
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Real-time:** Socket.IO client

### Database (`/database`)
- **Engine:** PostgreSQL 15
- **Migrations:** SQL migration files
- **Schema:** Optimized for neurodivergent user data

## 🎯 Features

### Core Coaching Flow
1. **Context Check-In** - Event type, feelings, setting, participants, goals
2. **Emotional Calibration** - Anxiety, excitement, energy, focus sliders
3. **Personalized Checklist** - Customized based on user profile and triggers
4. **Practice/Simulation** - Script practice with feedback
5. **Live Interaction Support** - Real-time guidance during events
6. **Post-Interaction Reflection** - Analysis and improvement suggestions

### Neurodivergent Support
- **ADHD-friendly:** Clear step sequencing, focus aids, energy management
- **Autism-friendly:** Sensory considerations, clear communication patterns
- **Social Anxiety:** Gradual exposure, safety strategies, affirmation support
- **High Masking:** Authentic self-expression encouragement

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

**Docker:**
```bash
docker-compose up -d                    # Start all services
docker-compose -f docker-compose.dev.yml up -d  # Development only
./scripts/deploy.sh                     # Production deployment
./scripts/dev-setup.sh                  # Development setup
```

### Environment Variables

See `.env.example` for required configuration:

- `POSTGRES_PASSWORD` - Database password
- `DATABASE_URL` - Full database connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `ANTHROPIC_API_KEY` - For AI coaching features
- `LASTFM_API_KEY` - Music compatibility features
- `SPOTIFY_CLIENT_ID` - Spotify integration
- `SPOTIFY_CLIENT_SECRET` - Spotify integration

## 🐳 Docker Deployment

### Production Stack
- **Frontend:** Next.js standalone container
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL 15 with persistent volumes
- **Cache:** Redis 7 with persistent volumes
- **Proxy:** Nginx with SSL termination and load balancing

### Health Checks
All services include health check endpoints:
- Backend: `GET /health`
- Frontend: `GET /api/health`
- Database: `pg_isready`
- Redis: `redis-cli ping`

## 🔒 Security

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **JWT** authentication
- **Environment variable** protection

## 📊 Monitoring

- Health check endpoints for all services
- Docker health checks
- Structured logging
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation

---

**Built with ❤️ for the neurodivergent community**