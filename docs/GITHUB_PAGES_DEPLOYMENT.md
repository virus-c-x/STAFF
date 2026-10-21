# GitHub Pages Deployment Guide

This project is fully architected for seamless deployment to **GitHub Pages** as a high-performance static client connected to a secure **Supabase** backend.

---

## 1. Prerequisites

1. A GitHub repository containing this codebase.
2. A free [Supabase](https://supabase.com) project with the PostgreSQL schema applied.

---

## 2. Setting Up GitHub Actions for GitHub Pages

Create a file named `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy Staff Recruitment Portal to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 3. Configuring Repository Secrets & Variables

In your GitHub repository:
1. Navigate to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`).
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase **anon public key** (`eyJhb...`).

> **Security Rule**: Never commit service-role keys or private email tokens. The `VITE_SUPABASE_ANON_KEY` is designed to be public because data security is enforced at the database level via Row Level Security (RLS).

---

## 4. Vite Base Path Configuration

If your repository is hosted at `https://<username>.github.io/<repo-name>/`, ensure Vite is configured with the correct relative base path:

In `vite.config.ts`:
```typescript
export default defineConfig({
  base: './', // Ensures relative assets load on GitHub Pages subpaths
  // ... plugins
});
```

---

## 5. Enable GitHub Pages

1. In GitHub, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push a commit to your `main` branch. The action will build and deploy the application within ~1 minute!
