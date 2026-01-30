# How to see the app

The Cursor in-IDE browser often **cannot** reach `localhost` on your machine, so it may show a connection error. Use one of these:

---

## Option 1: System browser (recommended)

1. In a **terminal** (Cursor or macOS Terminal):
   ```bash
   cd "/Users/mnstr/Desktop/Use Case Scanner"
   npm install
   npm run dev
   ```
2. When you see `Local: http://localhost:5173/`, run in **another terminal**:
   ```bash
   npm run open
   ```
   That opens **Safari or Chrome** to the app. The app will display there.

---

## Option 2: Cursor Simple Browser / Preview

1. Start the dev server (same as above: `npm install` then `npm run dev`).
2. In Cursor: **Command Palette** (`Cmd+Shift+P`) → type **“Simple Browser”** or **“Preview”**.
3. Choose the command that opens a browser panel (e.g. **“Simple Browser: Show”**).
4. Enter: `http://localhost:5173` and press Enter.

The app should load in that panel if it runs in your host environment.

---

## Option 3: Run from Cursor tasks

1. **Terminal → Run Task…** (or `Cmd+Shift+P` → “Tasks: Run Task”).
2. Choose **“Start dev server”**.
3. Wait until the task log shows the local URL.
4. Run task **“Open in system browser”** or open `http://localhost:5173` in Simple Browser as in Option 2.

---

## Option 4: Cursor browser (via tunnel)

To load the app **in the Cursor browser tab** (the one the AI can open), the browser needs a public URL instead of localhost:

1. **Terminal 1:** Start the dev server:
   ```bash
   npm run dev
   ```
2. **Terminal 2:** Start a tunnel:
   ```bash
   npm run tunnel
   ```
   You’ll see a URL like `https://random-words.loca.lt`. Copy it.
3. **In Cursor:** Open the Cursor browser (or ask the AI to “open [your URL] in the Cursor browser”) and paste that URL, or paste it in the browser’s address bar.

The app will load in the Cursor browser. Leave both `npm run dev` and `npm run tunnel` running.

---

If you still see a blank or error page, check the terminal for build errors and the browser dev tools (F12) for console errors.
