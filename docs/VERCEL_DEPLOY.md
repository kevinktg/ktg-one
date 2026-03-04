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

## Adding a Custom Domain

### If Domain Was Connected to a Deleted Project

If your domain was previously connected to an old/deleted Vercel project:

1. **Check for Orphaned Domain:**
   - Go to Vercel Dashboard → **Settings** (top right) → **Domains**
   - Look for your domain in the list
   - If it shows as connected to a deleted project, click on it

2. **Remove from Old Project:**
   - Click the three dots (⋯) next to the domain
   - Select **Remove** or **Delete**
   - Confirm removal

3. **Add to New Project (ktg-one):**
   - Go to **ktg-one** project → **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain (e.g., `yourdomain.com`)
   - Click **Add**

### First Time Adding a Domain

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain (e.g., `yourdomain.com` or `www.yourdomain.com`)
   - Click **Add**

2. **Configure DNS at your domain registrar:**
   - **Root domain** (`yourdomain.com`): Add **A record** → `76.76.21.21`
   - **www subdomain** (`www.yourdomain.com`): Add **CNAME** → `cname.vercel-dns.com`
   - Wait for DNS propagation (can take minutes to 48 hours)

3. **Verify in Vercel:**
   - Return to **Settings** → **Domains**
   - Click **Refresh** to check verification status
   - Once verified (green checkmark), your domain is live!

**Note:** If you get an error saying the domain is already in use, you'll need to remove it from the old project first (see steps above).

## Managing the Default vercel.app Domain

**Recommended: Keep and Redirect**
- In **Settings** → **Domains**, find your `*.vercel.app` domain
- Click **Edit** (or three dots → Edit)
- Set **Redirect to** your custom domain
- This preserves any existing links/bookmarks

**Alternative: Delete**
- In **Settings** → **Domains**, find your `*.vercel.app` domain
- Click three dots → **Delete**
- Note: Deployment URLs (e.g., `ktg-one-abc123.vercel.app`) will still exist for each deployment - these are internal and cannot be removed

