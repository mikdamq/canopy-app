# Putting Lamina live on your Namecheap hosting (cPanel)

The live site, **laminafarm.app**, runs on your Namecheap hosting through cPanel's **Setup Node.js App**. Netlify is only for staging and previews.

How it works:
1. **GitHub builds the site for you.** Every time a change is merged into `main`, GitHub makes a ready-to-run package. Building is too heavy for shared hosting, so it happens there.
2. **GitHub publishes it for you.** It uploads the package to your `lamina` folder over an encrypted connection (FTPS), using an FTP account that can only see that folder, then restarts the app. The only manual step left is pressing **Run NPM Install** on the rare occasions the core packages change; GitHub shows a yellow warning when that's needed.
   - The package is also kept for 30 days as a zip (`lamina-cpanel`), so you can always upload it by hand instead.
3. **Settings live in two places:**
   - **Secret** ones (Supabase key, mailbox password) go in cPanel's Node.js app settings. Never put them in GitHub or chat.
   - **Public** ones (site address, Umami and Clarity IDs) go in GitHub, because they're built into the pages.

No DNS changes are needed: `laminafarm.app` already points at your hosting.

---

## Part 1: one-time setup (about 30 minutes)

### 1. Check the Node.js version
- [ ] cPanel → **Setup Node.js App** → **Create Application** → open the **Node.js version** list.
- [ ] Pick **22.x** if it's listed (GitHub builds the site with Node 22); otherwise the highest version from **20.9** up, e.g. **24.21.0** (your plan offers it). If nothing is 20.9 or newer, stop and tell me.

### 2. Create the application
Fill in the form:

| Field | Value |
|---|---|
| Node.js version | 22.x if listed, otherwise 24.x |
| Application mode | **Production** |
| Application root | `lamina` (a folder in your home directory, **not** inside `public_html`) |
| Application URL | `laminafarm.app` (leave the path after it empty) |
| Application startup file | `app.js` |

- [ ] Under **Environment variables**, click **Add Variable** for each of the server settings in Part 3 (you can add them later too).
- [ ] Click **Create**. cPanel makes the `lamina` folder with a sample `app.js`, which the next step replaces.
- [ ] Your domain also has its own folder, `/home/chefxmkt/laminafarm.app` (cPanel made it when the domain was added). Leave it where it is: on **Create**, cPanel puts a small `.htaccess` file in it that hands visitors to the app. Open it in File Manager (with hidden files shown) and delete any placeholder page such as `index.html`, `index.php` or `default.html`, which could show instead of Lamina. **Keep** `.htaccess` and `.well-known` (AutoSSL needs it).

### 3. Let GitHub publish for you (recommended, 10 min)
**a. An FTP account that can only see the site's folder**
- [ ] cPanel → **FTP Accounts** → **Add FTP Account**.
- [ ] Log In: `deploy` (it becomes `deploy@laminafarm.app`). Password: generate a strong one and save it in your password manager. **Secret.**
- [ ] **Directory:** change it to `lamina` (cPanel suggests `public_html/deploy`; replace that with just `lamina`). This is what limits the account to the site's folder.
- [ ] Click **Create FTP Account**.
- [ ] Next to the new account, click **Configure FTP Client** and note the **FTP Server** name. Use the server's own name if it shows one, like `server123.web-hosting.com`: that name matches the server's security certificate.

**b. Give GitHub the three details** (stored encrypted; nobody can read them back, me included)
- [ ] github.com/mikdamq/canopy-app → **Settings → Secrets and variables → Actions → Secrets** tab → **New repository secret**, three times:
  - `FTP_SERVER`: the FTP Server name from step a;
  - `FTP_USERNAME`: `deploy@laminafarm.app`;
  - `FTP_PASSWORD`: the password. Paste it only here, never in chat.

**c. Publish for the first time**
- [ ] GitHub → **Actions** → **cPanel package** → **Run workflow** → branch `main` → **Run workflow**.
- [ ] Wait for the green tick (about 2 minutes). It's normal to see a yellow warning saying "Run NPM Install" this first time.
- [ ] Then skip to step 5.

### 3b. Or: download the package from GitHub (by hand)
- [ ] Go to github.com/mikdamq/canopy-app → **Actions** → **cPanel package** (left side) → open the latest green run on `main`.
- [ ] At the bottom, under **Artifacts**, click **lamina-cpanel** to download it.
- [ ] It downloads as a zip that contains `lamina-cpanel.zip`. Unzip it once on your computer to get `lamina-cpanel.zip`.

### 4. Upload it to cPanel (only if you did 3b)
- [ ] cPanel → **File Manager** → top right **Settings** → tick **Show Hidden Files (dotfiles)** → Save. The site needs its hidden `.next` folder and `.npmrc` file.
- [ ] Open your **home directory** (the folder that *contains* `lamina` and `public_html`).
- [ ] **Upload** `lamina-cpanel.zip` there.
- [ ] Right-click it → **Extract** into the home directory. It fills the `lamina` folder; allow it to overwrite the sample `app.js`.
- [ ] Delete `lamina-cpanel.zip` afterwards.

### 5. Install and start
- [ ] cPanel → **Setup Node.js App** → click the pencil next to `laminafarm.app`.
- [ ] Click **Run NPM Install**. It downloads the three packages the site needs; this takes a minute or two.
  - cPanel may then say *"An error occured… content type … doesn't equal…"*. That's harmless: it only means the page changed from cPanel's placeholder to Lamina. Carry on.
- [ ] Click **Restart**.
- [ ] Open **https://laminafarm.app**. You should see Lamina. The first visit after a restart can take a few seconds.

### 6. The padlock (HTTPS)
`.app` domains only open over HTTPS.
- [ ] cPanel → **SSL/TLS Status** → tick `laminafarm.app` and `www.laminafarm.app` → **Run AutoSSL**. It's free, and it renews itself.

---

## Part 2: each update

**With the FTP secrets set (step 3), there's nothing to do.** Each merge to `main` publishes and restarts the site by itself, within a few minutes.
- If GitHub shows a yellow **"Run NPM Install"** warning on that run, open **Setup Node.js App** → pencil → **Run NPM Install** → **Restart**. It only happens when the core packages change.
- If a run turns red, open it and send me a screenshot of the red step.

**By hand (no FTP secrets):** download the newest **lamina-cpanel** package (step 3b), upload and extract it (step 4), then **Run NPM Install** → **Restart**.

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

- **The publish step fails with "Login failed":** re-check the three GitHub secrets (step 3, part b). The username is the full `deploy@laminafarm.app`.
- **The publish step fails with a certificate error:** use the server's own name for `FTP_SERVER` (from **Configure FTP Client**), not `ftp.laminafarm.app`.
