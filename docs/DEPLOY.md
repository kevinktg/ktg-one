# Deployment Instructions

## GitHub Setup

If you don't have a GitHub repo yet:

1. Go to https://github.com/new
2. Create a new repository named `ktg-one`
3. Don't initialize with README
4. Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ktg-one.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository `ktg-one`
4. Vercel will auto-detect Next.js
5. Click "Deploy"

That's it! Vercel will handle everything automatically.

## Manual GitHub Push (if needed)

```bash
git remote add origin https://github.com/YOUR_USERNAME/ktg-one.git
git branch -M main
git push -u origin main
```

