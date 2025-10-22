# Houses App

A neurodivergent-friendly dating application that celebrates unique ways of connecting through music, shared interests, and AI-guided interactions.

![CI/CD Pipeline](https://github.com/your-org/houses-app/workflows/CI%2FCD%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

## 🏠 Overview

Houses is a dating platform designed specifically for neurodivergent individuals, featuring:

- **House-based matching system** - Users are sorted into houses (Logic, Creation, Chaos, Observation) based on their personality and communication style
- **Music compatibility** - Deep integration with Spotify and Last.fm for music-based matching
- **AI-powered quest guides** - Personalized conversation starters and date ideas powered by Claude
- **Sensory-friendly design** - Accessible UI with customizable sensory preferences
- **Real-time chat** - WebSocket-based messaging with typing indicators
- **Safe interaction tools** - Exit strategies, pacing guides, and stim break reminders

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/houses-app.git
cd houses-app

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration

# Start all services
docker-compose -f docker-compose.dev.yml up
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

### Manual Setup

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## 🏗️ Architecture

```
houses-app/
├── frontend/          # Next.js 14 app with TypeScript
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── public/
├── backend/           # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
├── database/          # PostgreSQL schemas
│   ├── migrations/
│   └── seed-data.sql
└── docker-compose.yml
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand
- **API Client**: TanStack Query
- **Real-time**: Socket.io Client

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt
- **External APIs**: Supabase, Spotify, Last.fm, Anthropic

### Infrastructure
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Deployment**: AWS ECS / Google Cloud Run / Kubernetes

## 📝 API Documentation

The API follows RESTful conventions with JWT authentication.

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/matches/potential` - Get potential matches
- `POST /api/quests/generate` - Generate AI quest
- `GET /api/conversations` - List conversations
- `POST /api/music/sync` - Sync music data

Full API documentation available at `/api/docs` when running the backend.

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage

We maintain >80% code coverage across the codebase. Coverage reports are generated in the `coverage/` directories.

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:

- Docker deployment
- Cloud deployment (AWS, GCP, Azure)
- Kubernetes deployment
- SSL/TLS configuration
- Monitoring setup
- Backup procedures

## 🔒 Security

- JWT-based authentication
- Rate limiting on all API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS properly configured
- Helmet.js for security headers
- Environment variable encryption

## 📊 Performance

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Image optimization with Next.js
- Lazy loading and code splitting
- WebSocket connection pooling
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The neurodivergent community for invaluable feedback
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Anthropic](https://www.anthropic.com/) for Claude AI integration
- All our contributors and testers

## 📞 Support

- Documentation: [docs.houses.app](https://docs.houses.app)
- Issues: [GitHub Issues](https://github.com/your-org/houses-app/issues)
- Discord: [Join our community](https://discord.gg/houses-app)
- Email: support@houses.app