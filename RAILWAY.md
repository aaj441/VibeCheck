# Railway Deployment Guide

This project is configured to deploy to Railway using Nixpacks.

## Configuration Files

- `railway.toml` - Railway-specific configuration
- `nixpacks.toml` - Nixpacks build configuration
- `Procfile` - Process configuration (fallback)

## How Railway Builds This Project

1. **Setup Phase**: Installs Node.js 20
2. **Install Phase**: Runs `npm install` in `houses-app/backend`
3. **Build Phase**: Runs `npm run build` in `houses-app/backend` (compiles TypeScript)
4. **Start**: Runs `npm start` in `houses-app/backend` (runs the compiled JavaScript)

## Required Environment Variables

Set these in your Railway project settings:

### Essential
- `PORT` - Railway will set this automatically
- `NODE_ENV` - Set to `production`
- `DATABASE_URL` - PostgreSQL connection string (add PostgreSQL plugin in Railway)

### Optional (based on features you use)
- `REDIS_URL` - Redis connection string (add Redis plugin in Railway)
- `JWT_SECRET` - Secret for JWT token signing
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `ANTHROPIC_API_KEY` - Claude API key for AI features
- `LASTFM_API_KEY` - Last.fm API key
- `SPOTIFY_CLIENT_ID` - Spotify OAuth client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify OAuth client secret

## Adding a Database

1. In Railway, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically set the `DATABASE_URL` environment variable
3. Run migrations manually or add a migration step to your deployment

## Troubleshooting

### Build fails with "Cannot find module"
- Check that all dependencies are in `package.json`
- Make sure `@types/*` packages are in `devDependencies`

### Server won't start
- Check that `PORT` environment variable is set
- Verify `DATABASE_URL` is correct
- Check Railway logs for error messages

### "No build plan found"
- This should be fixed by the `railway.toml`, `nixpacks.toml`, and `Procfile`
- Make sure these files are committed to your repository
