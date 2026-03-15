# Deployment Guide

## Build

### Frontend

```bash
npm run build
```

Output is generated at `dist/dev/`. This contains the production-optimized Angular bundle.

**Budget Limits** (configured in `angular.json`):
- Initial bundle: 2 MB warning, 5 MB error
- Per-component: 300 kB warning, 500 kB error

### Server

```bash
cd server && npm run build
```

Compiles TypeScript to JavaScript.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/bookstore` | MongoDB connection string |
| `NODE_ENV` | — | Set to `production` to hide error stack traces |

## Production Considerations

### Security

The server includes production-ready security middleware:
- **Helmet** — Sets security headers (CSP, HSTS, X-Frame-Options, etc.)
- **CORS** — Configured for cross-origin requests
- **Joi validation** — All request inputs are validated and unknown fields stripped
- **Error handling** — Stack traces are hidden in production (`NODE_ENV=production`)

### Database

- Ensure MongoDB is accessible from the deployment environment
- The seed script (`npm run seed`) should be run once on first deployment
- Book model has indexes on: `id`, `title`, `author`, `price`, `category`, `genre`, `isbn`, `rating`, `createdAt`, plus a text index on `title`, `author`, `description`

### Static Files

Serve the `dist/dev/` output with any static file server (Nginx, Caddy, etc.) or a cloud provider (Vercel, Netlify, AWS S3 + CloudFront).

### API Proxy

In production, configure a reverse proxy so the frontend can reach the API. Example Nginx config:

```nginx
server {
    listen 80;

    location /api/ {
        proxy_pass http://localhost:3000;
    }

    location / {
        root /path/to/dist/dev/browser;
        try_files $uri $uri/ /index.html;
    }
}
```