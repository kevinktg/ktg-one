# GitHub SSH Setup

## Step 1: Add SSH Key to GitHub

1. Copy your SSH public key (shown above)
2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste the key and save

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `ktg-one`
3. Don't initialize with README
4. Click "Create repository"

## Step 3: Add Remote and Push

After creating the repo, run:

```bash
git remote add origin git@github.com:YOUR_USERNAME/ktg-one.git
git push -u origin master
```

Replace `YOUR_USERNAME` with your GitHub username.

## Test SSH Connection

```bash
ssh -T git@github.com
```

You should see: "Hi YOUR_USERNAME! You've successfully authenticated..."


