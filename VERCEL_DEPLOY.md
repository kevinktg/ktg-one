# Vercel Deployment

Vercel CLI is now installed! To deploy:

## First Time Setup

1. **Login to Vercel:**
   ```bash
   vercel login
   ```
   This will open your browser to authenticate.

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: **ktg-one** (or press enter for default)
   - Directory: **./** (press enter)
   - Override settings? **No** (press enter)

3. **Deploy to Production:**
   ```bash
   vercel --prod
   ```
   Or use the npm script:
   ```bash
   npm run deploy
   ```

## After First Deployment

- Vercel will create a `.vercel` folder with your project config
- Future deployments: Just run `vercel --prod` or `npm run deploy`
- Vercel will auto-detect changes and redeploy

## Environment Variables

If you need env variables later:
```bash
vercel env add VARIABLE_NAME
```

## View Deployments

- Dashboard: https://vercel.com/dashboard
- Or run: `vercel ls`

