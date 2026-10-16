# Getting found: Google Search Console and Bing Webmaster Tools

**What this does:** it tells Google and Bing that laminafarm.app is yours, hands them the list of every page (the sitemap), and shows you which searches bring people to the site. Bing also feeds Microsoft Copilot, DuckDuckGo and ChatGPT's web search, so it's worth the extra two minutes.

**Time:** about 15 minutes, plus a short wait for Google to check.
**You need:** a Google account, and your Namecheap login (for cPanel).
**Nothing here is secret.** The code Google gives you is public by design (anyone can see DNS records), so it's fine to paste it into cPanel or share it with me.

---

## Part 1: Google Search Console (about 10 minutes)

### 1. Add the site

1. Open **https://search.google.com/search-console** and sign in with the Google account you want to keep for Lamina.
2. If it's your first time, you'll see **"Welcome to Google Search Console"** with two boxes. If not, click the property menu at the top left, then **+ Add property**.
3. Use the **left box, "Domain"**, not "URL prefix". The Domain option covers `https://`, `www.` and every page in one go.
4. Type **`laminafarm.app`**, with no `https://` and no `www`, then press **Continue**.

### 2. Copy the check code

Google shows a window titled **"Verify domain ownership via DNS record"**, with a line starting `google-site-verification=…`.

1. Leave **Record type** on **TXT**.
2. Press **Copy** next to the code.
3. **Keep this window open.** You'll come back to press Verify.

### 3. Paste it into cPanel

1. In a new tab, sign in to **Namecheap → Hosting List → Go to cPanel**.
2. In cPanel, search for **Zone Editor** and open it.
3. On the **laminafarm.app** row, press **Manage**. (Don't use "+ A Record" or "+ CNAME Record" on that row.)
4. Press the **+ Add Record** button. In the new row:
   - **Name:** `laminafarm.app.` (with the dot at the end; cPanel usually fills it in);
   - **TTL:** leave it as it is (e.g. `14400`);
   - **Type:** **TXT**;
   - **Record:** paste the code you copied (`google-site-verification=…`).
5. Press **Save Record**.

> ⚠️ You'll already see one or more TXT records there, e.g. one starting `v=spf1` (it lets your mailbox send email). **Leave them alone and add a new one.** A domain can have several TXT records.

### 4. Verify

1. Go back to the Google tab and press **Verify**.
2. If it says **"Ownership verified"**, you're done with this step. 🎉
3. If it says it couldn't find the record, that's normal: the record takes a little while to spread. Press **Close**, wait **15–60 minutes**, then open Search Console again and press **Verify** on the waiting property. Very rarely it takes up to a day.

### 5. Send the sitemap

The sitemap is the list of all 30+ pages in both languages. The site builds it by itself.

1. In Search Console's left menu, open **Sitemaps**.
2. Under **"Add a new sitemap"**, type **`sitemap.xml`** after the address that's already shown, then press **Submit**.
3. The status will say **"Success"** (sometimes after a few hours). If it says "Couldn't fetch", wait a day and look again before worrying.

### 6. Optional: ask Google to visit the key pages now

Google will find every page through the sitemap anyway; this only speeds up the first few.

1. Paste each address into the search box at the top of Search Console, press Enter, then press **Request indexing**:
   - `https://laminafarm.app/en`
   - `https://laminafarm.app/ar`
   - `https://laminafarm.app/en/product`
   - `https://laminafarm.app/en/learn` (once the guides are live)
2. Google allows about 10 of these a day, so stop there.

### What to expect

- **First numbers:** after 2–3 days, under **Performance**.
- **Pages showing up in Google:** over 1–4 weeks. New sites start slowly; that's normal.
- **Emails from Google:** it will email you about problems (for example "page not indexed"). Forward anything that looks worrying to me.

---

## Part 2: Bing Webmaster Tools (about 3 minutes, after Part 1)

Do this **after** Google has verified the site, because Bing can copy everything from Google.

1. Open **https://www.bing.com/webmasters** and press **Sign in**. You can use the **same Google account**; you don't need a Microsoft account.
2. On the welcome screen, choose **"Import your sites from GSC"** (Google Search Console) and press **Import**.
3. Allow Bing to read your Search Console, then tick **laminafarm.app** and press **Import**.
4. That's it: the site is verified and the sitemap is added. Bing shows its first numbers after a few days.

If the import option doesn't appear, choose **"Add your site manually"**, type `https://laminafarm.app`, pick **"Domain Connect"** or **"DNS"**, and add the TXT record it gives you in the same way as Part 1, step 3.

---

## Part 3: Once a month (5 minutes)

- **Google → Performance:** which searches show the site, and how many people click. Send me the top 10 searches when there are some, and I'll write guides around them.
- **Google → Pages:** check the "Not indexed" count isn't growing. A few pages listed as "Page with redirect" are normal (the old and short addresses).
- **Bing → Search performance:** the same, for Bing and Copilot.

---

## Questions

**Do I need to do anything when we add new pages or guides?**
No. The sitemap updates itself on every merge, and Google re-reads it.

**Why is the demo not in the sitemap?**
On purpose: every farm name makes a new demo address, and we don't want hundreds of copies in Google. The demo is marked "don't index".

**Will this slow the site down or add cookies?**
No. Search Console and Bing work from the outside; nothing is added to the site.
