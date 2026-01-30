# Add this project to GitHub as a new repo

## Option A: One script (if you use GitHub CLI)

1. **Log in to GitHub CLI** (your token may be expired):
   ```bash
   gh auth login
   ```
2. **Run the script** from this folder:
   ```bash
   cd "/Users/mnstr/Desktop/Use Case Scanner"
   chmod +x push-to-github.sh
   ./push-to-github.sh use-case-scanner
   ```
   That will init Git, commit, create a new public repo on your GitHub, and push. Done.

---

## Option B: Manual steps

### 1. Initialize Git and make the first commit

```bash
cd "/Users/mnstr/Desktop/Use Case Scanner"

git init
git add .
git commit -m "Initial commit: Use Case Scanner"
```

### 2. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `use-case-scanner` (or any name you like).
3. **Description (optional):** Enterprise AI Use Case Scanner — discover existing capabilities and build what's missing.
4. Choose **Public** (or Private).
5. **Do not** check "Add a README" (you already have one).
6. Click **Create repository**.

### 3. Connect and push

GitHub will show you commands; use these (replace `YOUR_USERNAME` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/use-case-scanner.git
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/use-case-scanner.git
git push -u origin main
```

Done. Your repo will be at `https://github.com/YOUR_USERNAME/use-case-scanner`.
