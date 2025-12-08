# 🚀 How to Add POIA to GitHub

Step-by-step guide to push your POIA project to GitHub.

## ✅ Prerequisites

- Git is installed (already initialized in your project)
- GitHub account (create one at https://github.com if you don't have one)

## 📋 Step-by-Step Instructions

### Step 1: Verify .env is Ignored

Your `.env` file should NOT be committed (it contains sensitive API keys and private keys).

✅ Already configured in `.gitignore` - your `.env` file will be ignored.

### Step 2: Add All Files to Git

```bash
git add .
```

This adds all files except those in `.gitignore` (like `.env`, `node_modules`, etc.)

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: POIA - Proof-of-Intent Agents on Polygon Amoy"
```

### Step 4: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click the "+" icon** in the top right
4. **Select "New repository"**
5. **Fill in the details**:
   - Repository name: `poia-app` (or any name you prefer)
   - Description: `POIA - Proof-of-Intent Agents: On-chain AI intent execution layer on Polygon`
   - Visibility: Choose **Public** or **Private**
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

### Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/poia-app.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### Step 6: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. Verify that `.env` is **NOT** visible (it should be ignored)

## 🔒 Security Checklist

Before pushing, make sure:

- ✅ `.env` file is in `.gitignore` (already done)
- ✅ No API keys in code files
- ✅ No private keys in code files
- ✅ `node_modules` is ignored
- ✅ Build artifacts are ignored

## 📝 Quick Commands Summary

```bash
# 1. Add all files
git add .

# 2. Commit
git commit -m "Initial commit: POIA - Proof-of-Intent Agents"

# 3. Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/poia-app.git

# 4. Push to GitHub
git push -u origin main
```

## 🔄 Future Updates

After making changes:

```bash
# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

## 🐛 Troubleshooting

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/poia-app.git
```

### "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Authentication Issues
- Use GitHub Personal Access Token instead of password
- Or use SSH keys for authentication

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

---

**Ready to push?** Follow the steps above and your POIA project will be on GitHub! 🎉

