# Vercel Deployment Instructions

## Quick Deploy (2 minutes)

### Option 1: One-Click Import
1. **Go to:** https://vercel.com/new/clone?repository-url=https://github.com/hellolucient/spa-review-drafts&project-name=spa-review-drafts&repository-name=spa-review-drafts
2. **Select hellolucient account** (if prompted)
3. **Click Deploy** (no environment variables needed - template fallback works without OpenAI key)
4. **Wait ~30 seconds** for deployment
5. **Copy the production URL** (e.g., `spa-review-drafts.vercel.app`)

### Option 2: Import from Dashboard
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose `hellolucient/spa-review-drafts` from GitHub
4. Branch: `main`
5. Framework Preset: Next.js (auto-detected)
6. Root Directory: `./`
7. Build Command: (leave default) `npm run build`
8. Output Directory: (leave default) `.next`
9. Install Command: (leave default) `npm install`
10. **Environment Variables:** Skip (not required for Try a Sample to work)
11. Click **Deploy**

### Option 3: Vercel CLI (if logged in as hellolucient)
```bash
vercel login
vercel --prod
```

## Settings After Deployment

### No Deployment Protection Needed
The app should be publicly accessible without SSO or protection. Verify in:
- Project Settings → Deployment Protection → **Disabled**

### Optional: Add OpenAI Key Later
If you want AI-generated replies instead of templates:
1. Go to Project Settings → Environment Variables
2. Add: `OPENAI_API_KEY` = `sk-your-key-here`
3. Redeploy

### Expected Production URL Format
- `https://spa-review-drafts.vercel.app`
- Or custom domain if configured

## Verification Steps
1. Visit the production URL
2. Click "Try a Sample"
3. Click "Draft Replies"
4. Confirm 3 drafts appear
5. Test from Southeast Asia (Trent's location)

## Troubleshooting

### If Trent gets 403 in Southeast Asia:
- Verify Deployment Protection is **off** in Project Settings
- Check Vercel doesn't have geo-blocking enabled
- Try the production domain (not vercel-preview domains)

### If the app doesn't work:
- Check build logs for errors
- Verify Node.js version (22.x works)
- Confirm no environment variables are required

## For Cloud Agent: Add VERCEL_TOKEN

To enable automated deployments, add to Cursor Dashboard → Cloud Agents → Secrets:

```
VERCEL_TOKEN=<your-vercel-token>
```

Get token from: https://vercel.com/account/tokens

Scope: hellolucient account, full access
