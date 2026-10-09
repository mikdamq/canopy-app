# Putting Lamina live on your Namecheap hosting (cPanel)

The live site, **laminafarm.app**, runs on your Namecheap hosting through cPanel's **Setup Node.js App**. Netlify is only for staging and previews.

How it works:
1. **GitHub builds the site for you.** Every time a change is merged into `main`, GitHub makes a ready-to-run package called `lamina-cpanel.zip`. Building is too heavy for shared hosting, so it happens there.
2. **You upload that zip to cPanel** and press two buttons: **Run NPM Install**, then **Restart**.
3. **Settings live in two places:**
   - **Secret** ones (Supabase key, mailbox password) go in cPanel's Node.js app settings. Never put them in GitHub or chat.
   - **Public** ones (site address, Umami and Clarity IDs) go in GitHub, because they're built into the pages.

No DNS changes are needed: `laminafarm.app` already points at your hosting.

---

## Part 1: one-time setup (about 30 minutes)

### 1. Check the Node.js version
- [ ] cPanel → **Setup Node.js App** → **Create Application** → open the **Node.js version** list.
- [ ] Pick the highest **22.x** (or at least **20.9**). If the highest on offer is below 20.9, stop and tell me; the site needs 20.9 or newer.

### 2. Create the application
Fill in the form:

| Field | Value |
|---|---|
| Node.js version | the highest 22.x |
| Application mode | **Production** |
| Application root | `lamina` (a folder in your home directory, **not** inside `public_html`) |
| Application URL | `laminafarm.app` (leave the path after it empty) |
| Application startup file | `app.js` |

- [ ] Under **Environment variables**, click **Add Variable** for each of the server settings in Part 3 (you can add them later too).
- [ ] Click **Create**. cPanel makes the `lamina` folder with a sample `app.js`, which the next step replaces.

### 3. Download the package from GitHub
- [ ] Go to github.com/mikdamq/canopy-app → **Actions** → **cPanel package** (left side) → open the latest green run on `main`.
- [ ] At the bottom, under **Artifacts**, click **lamina-cpanel** to download it.
- [ ] It downloads as a zip that contains `lamina-cpanel.zip`. Unzip it once on your computer to get `lamina-cpanel.zip`.

### 4. Upload it to cPanel
- [ ] cPanel → **File Manager** → top right **Settings** → tick **Show Hidden Files (dotfiles)** → Save. The site needs its hidden `.next` folder and `.npmrc` file.
- [ ] Open your **home directory** (the folder that *contains* `lamina` and `public_html`).
- [ ] **Upload** `lamina-cpanel.zip` there.
- [ ] Right-click it → **Extract** into the home directory. It fills the `lamina` folder; allow it to overwrite the sample `app.js`.
- [ ] Delete `lamina-cpanel.zip` afterwards.

### 5. Install and start
- [ ] cPanel → **Setup Node.js App** → click the pencil next to `laminafarm.app`.
- [ ] Click **Run NPM Install**. It downloads the three packages the site needs; this takes a minute or two.
- [ ] Click **Restart**.
- [ ] Open **https://laminafarm.app**. You should see Lamina. The first visit after a restart can take a few seconds.

### 6. The padlock (HTTPS)
`.app` domains only open over HTTPS.
- [ ] cPanel → **SSL/TLS Status** → tick `laminafarm.app` and `www.laminafarm.app` → **Run AutoSSL**. It's free, and it renews itself.

---

## Part 2: each update (5 minutes)

When I tell you "merged, ready to publish":
1. Download the newest **lamina-cpanel** package from GitHub Actions (step 3).
2. Upload and extract it in your home directory, overwriting everything (step 4).
3. **Setup Node.js App** → pencil → **Run NPM Install** → **Restart**.
4. Open the site and check it.

The `BUILD.txt` file inside `lamina` shows which version is live.

---

## Part 3: where each setting goes

### In cPanel (Setup Node.js App → pencil → Environment variables)
These are read while the site runs. After changing any of them, click **Restart**.

| Name | Value | Secret? |
|---|---|---|
| `SUPABASE_URL` | the Supabase Project URL | no |
| `SUPABASE_SERVICE_ROLE_KEY` | the Supabase server key | **yes** |
| `SMTP_HOST` | the **Outgoing Server** from cPanel → Email Accounts → Connect Devices | no |
| `SMTP_PORT` | `465` | no |
| `SMTP_USER` | `hello@laminafarm.app` | no |
| `SMTP_PASS` | the mailbox password | **yes** |
| `MAIL_FROM` | `Lamina <hello@laminafarm.app>` | no |
| `REQUESTS_NOTIFY_EMAIL` | where new requests should go: `hello@laminafarm.app`, or your Gmail | no |

### In GitHub (repo → Settings → Secrets and variables → Actions → **Variables** tab)
These are built into the pages. After adding or changing one, rebuild: **Actions → cPanel package → Run workflow**. Then publish the new package (Part 2).

| Name | Value |
|---|---|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | your Umami Website ID |
| `NEXT_PUBLIC_UMAMI_SRC` | only if Umami's tracking code shows a script address other than `https://cloud.umami.is/script.js` (the EU region may use a different one) |
| `NEXT_PUBLIC_CLARITY_ID` | not needed: `yv5sglt7cp` is already the default |
| `NEXT_PUBLIC_SITE_URL` | not needed: `https://laminafarm.app` is already the default |

Never add the secret ones (Supabase key, mailbox password) to GitHub.

### On Netlify (staging only)
Leave out the Supabase and email settings on Netlify. Then test requests sent from a staging preview are only logged, and never reach your real database or inbox.

---

## If something goes wrong
- **"Incomplete response" or error 503:** open File Manager → `lamina` → `stderr.log` (if it's there), and send me the last 20 lines. They don't contain your passwords.
- **The site shows an old version:** check `BUILD.txt`, then repeat Part 2. Don't forget **Restart**.
- **Run NPM Install fails:** send me a screenshot of the message.
- **The form says it couldn't send:** check the cPanel settings in Part 3, especially the SMTP server and password, then Restart.

## Later (optional)
Publishing can become automatic: GitHub uploads the package itself after each merge. That needs an FTP account on your hosting, saved as a GitHub secret. We can set it up once the manual way works.
