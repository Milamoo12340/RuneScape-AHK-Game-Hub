# Railway Deployment Guide

## Quick Setup

### 1. Connect to Railway
```bash
railway connect
```

### 2. Set Environment Variables
```bash
railway variables set DATABASE_URL="your-postgresql-url"
railway variables set SESSION_SECRET="generate-a-secure-random-string"
railway variables set OPENAI_API_KEY="optional-openai-key"
railway variables set NODE_ENV="production"
```

### 3. Generate a Secure Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy
```bash
git push origin main
```

Railway will automatically:
1. Detect Node.js project
2. Install dependencies
3. Run build: `npm run build`
4. Start: `npm run start`
5. Database release command: `npm run db:push` (from Procfile)

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes (for production) | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Yes (for production) | 64-character hex string |
| `OPENAI_API_KEY` | No | `sk-...` |
| `NODE_ENV` | No | `production` |
| `PORT` | No | `5000` (default) |

## Automatic Setup

The app automatically:
- Detects if DATABASE_URL is set
- Falls back to in-memory storage if DATABASE_URL is missing
- Creates database tables on first run via `npm run db:push`
- Handles both Replit and Railway environments seamlessly

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly in Railway variables
- Check that PostgreSQL database is accessible from Railway
- Run `npm run setup-db` to manually initialize tables

### Session Store Errors
- Ensure `SESSION_SECRET` is set and at least 32 characters
- Database migrations will create `user_sessions` table automatically

### Build Failures
- Check `npm run build` locally
- Verify all dependencies are in package.json
- Check Node.js version compatibility

## Local Development

### With Local PostgreSQL
```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/runescapeapp"
npm install
npm run dev
```

### Without Database (In-Memory)
```bash
npm install
npm run dev
```

The app will start with mock data and operate in memory.
