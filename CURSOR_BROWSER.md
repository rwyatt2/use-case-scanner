# Show this app in the Cursor browser

The Cursor browser **cannot open localhost**. It runs in a separate environment, so `http://localhost:5173` will always show a connection error there.

To see your app **in the Cursor browser tab**:

---

## Step 1: Start the dev server

In a terminal:

```bash
cd "/Users/mnstr/Desktop/Use Case Scanner"
npm run dev
```

Leave it running. You should see: `Local: http://127.0.0.1:5173/`

---

## Step 2: Start a tunnel (second terminal)

Open a **second** terminal and run:

```bash
cd "/Users/mnstr/Desktop/Use Case Scanner"
npm run tunnel
```

You will see a line like:

```
your url is: https://clever-name-42.loca.lt
```

**Copy that full URL** (e.g. `https://clever-name-42.loca.lt`).

---

## Step 3: Open that URL in the Cursor browser

**Option A:** Paste the URL in this chat and say:  
**"Open this in the Cursor browser"** or **"Navigate Cursor browser to [paste URL]"**  
The AI will open it in the Cursor browser for you.

**Option B:** In Cursor, focus the Cursor browser panel, click the address bar, paste your tunnel URL, and press Enter.

---

After that, your app will load in the Cursor browser. Keep both `npm run dev` and `npm run tunnel` running.

If the tunnel URL asks for a "Click to continue" or password, click through it (localtunnel sometimes shows that once per tunnel).
