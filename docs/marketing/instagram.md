# Instagram plan

Written 20 Oct 2026. Instagram comes after LinkedIn is running. It's a visual channel: the 3D farm does the talking, captions stay short. **The visuals are made after the new logo is in.** The Arabic is for Mikdam to check before posting.

## The profile

- **Handle:** @laminafarm (or @lamina.farm if taken)
- **Name field** (searchable): `Lamina · 3D farm twins`
- **Profile photo:** the app icon / avatar from the new logo (square; Instagram makes it round)
- **Link:** `https://laminafarm.app/ar?utm_source=instagram&utm_medium=social&utm_campaign=bio` (Arabic first; the site has a language switch)
- **Bio** (one bio for both languages, under 150 characters):

> Your farm, alive in 3D 🌱
> مزرعتك حيّة بالأبعاد الثلاثية
> Live twins for indoor farms · Free pilots in Jordan & the Gulf ↓

- **Story highlights** (covers in the brand colours, made with the logo): Demo · العرض, Pilot · التجربة, Guides · أدلة, Farm types · الأنواع

## Formats

| Format | Size | Notes |
|---|---|---|
| Feed post / carousel | 1080 × 1350 (4:5) | The profile grid shows a narrower, taller 3:4 crop, so keep text away from the left and right edges |
| Reel | 1080 × 1920 (9:16) | Keep text out of the top ~250 px and the bottom ~340 px (caption and buttons sit there) |

The LinkedIn post images in `posts/` are already 4:5. **The demo clips in `clips/` are square (1080 × 1080, 15 s); Reels need vertical versions.** The clip script makes them: `clip.mjs <outDir> <en|ar> <tower|container|greenhouse|lab> 1080 1920 15` (see `README.md`).

## Captions

- **Both languages in one caption:** Arabic first, then English, with a blank line between them.
- **3 to 5 hashtags**, at the end.
- **Links don't work in captions:** end with "the link in our bio" / "الرابط في الحساب".
- **The tone matches LinkedIn**, but shorter: one idea per post.

## The first 9 posts

The grid alternates dark posts (the 3D farm at night, Reels) and light posts (type cards on the off-white ground), so the first nine form a checkerboard. Post them in this order, about two a week; the newest shows top left.

| # | Format | Ground | Content | From |
|---|---|---|---|---|
| 1 | Reel | Dark | Your farm, alive in 3D: the tower, day into night | Post 1 |
| 2 | Carousel (4) | Light | What a digital twin is: three myths | Post 7 |
| 3 | Reel | Dark | The container farm, zooming into one container | Post 2 |
| 4 | Single | Light | Water: 250 L vs 20 L per kg | Post 8 |
| 5 | Carousel (6) | Dark | Seed to delivery in five moments | Post 11 |
| 6 | Single | Light | Cost per kg, in one line | Post 10 |
| 7 | Reel | Dark | Switching the light recipe, watching growth speed change | Post 3 |
| 8 | Carousel (5) | Light | Which sensors first | Post 12 |
| 9 | Single | Dark | 3 months free: the pilot offer | Post 5 |

### 1 · Reel: your farm, alive in 3D

> هذه ليست لقطة من لعبة. هذه نسخة حيّة ثلاثية الأبعاد من مزرعة: كل طابق، وكل محصول، وكل صندوق، من البذرة حتى التوصيل.
> اكتب اسم مزرعتك وشاهدها حيّة. الرابط في الحساب.
>
> Not a game. A live 3D twin of a farm: every floor, every crop, every crate, from seed to delivery.
> Type your farm's name and see it live. Link in bio.
>
> #الزراعة_العمودية #VerticalFarming #DigitalTwin #AgTech

### 2 · Carousel: what a digital twin is

Slides: 1 "Digital twin? Three myths." 2 "Myth: it's a dashboard. It's your real layout." 3 "Myth: you need sensors. A spreadsheet is enough to start." 4 "It helps most where floors are slow to check on foot."

> التوأم الرقمي للمزرعة ليس لوحة بيانات، ولا يحتاج إلى حساسات لتبدأ. إنه نسخة حيّة من مزرعتك الحقيقية. اسحب لترى ثلاثة أمور يُساء فهمها.
>
> A farm digital twin isn't a dashboard, and you don't need sensors to start. It's a live copy of your real farm. Swipe for three common myths.
>
> #التوأم_الرقمي #DigitalTwin #IndoorFarming

### 3 · Reel: the container farm

> مزرعة الحاويات لا تشبه البرج العمودي، ولذلك لها نموذجها الخاص. ادخل إلى حاوية واحدة وشاهد مناخها وماءها وإضاءتها.
>
> A container farm isn't a tower, so it gets its own model. Step into one container and see its climate, water and light.
>
> #مزارع_الحاويات #ContainerFarming #Hydroponics #AgTech

### 4 · Single: water

Card: "250 L" and "20 L" with a lettuce mark; source line: Barbosa et al., 2015.

> خسّ الحقول: نحو 250 لترًا لكل كيلوغرام. خسّ البيوت المحمية المائية: نحو 20 لترًا (Barbosa وزملاؤه، 2015). لكن الزراعة المائية تحتاج إلى طاقة أكبر، فتابع الاثنين معًا.
>
> Field lettuce: about 250 L per kg. Hydroponic greenhouse lettuce: about 20 L (Barbosa et al., 2015). But hydroponics needs more energy, so track both.
>
> #الزراعة_المائية #الأمن_المائي #Hydroponics #WaterSecurity

### 5 · Carousel: seed to delivery

Slides: one per moment (seed, move, harvest, pack, deliver), then "One batch ID, from tray to crate."

> رقم واحد لكل دفعة، وخمس لحظات تسجّلها: الزراعة، والنقل، والحصاد، والتعبئة، والتسليم. هكذا تتتبّع أي صندوق حتى صينية بذوره.
>
> One ID per batch, five moments to record: seed, move, harvest, pack, deliver. That's how you trace any box back to its seed tray.
>
> #التتبع #Traceability #VerticalFarming #FarmOperations

### 6 · Single: cost per kg

Card: "Cost per kg = monthly running costs ÷ kilos sold".

> رقم واحد يحدّد إن كانت مزرعتك رابحة: تكلفة الكيلوغرام. احسب كل التكاليف، وقسّمها على ما بعته لا ما حصدته.
>
> One number decides whether your farm pays: cost per kilo. Count every cost, and divide by what you sold, not what you harvested.
>
> #إدارة_المزارع #FarmManagement #VerticalFarming

### 7 · Reel: light recipes

> بدّل وصفة الإضاءة وشاهد سرعة النمو والطاقة لكل كيلوغرام تتغيّر، قبل أن تلمس أي مصباح حقيقي. جرّبها في العرض، والرابط في الحساب.
>
> Switch the light recipe and watch growth speed and energy per kilo change, before you touch a real fixture. Try it in the demo, link in bio.
>
> #إضاءة_LED #LEDGrowLights #VerticalFarming #AgTech

### 8 · Carousel: which sensors first

Slides: 1 "Don't buy every sensor at once." 2 "First: air temperature and humidity per zone." 3 "First: pH, EC and water temperature per system." 4 "Next: CO₂, light, electricity per floor." 5 "Place air sensors at plant height, mid-zone."

> تبدأ مزرعة داخلية؟ لا تشترِ كل الحساسات دفعة واحدة. اسحب لترى من أين تبدأ، وأين تضع كل حساس.
>
> Starting an indoor farm? Don't buy every sensor at once. Swipe for where to start, and where each sensor goes.
>
> #الزراعة_الداخلية #IndoorFarming #Hydroponics #IoT

### 9 · Single: the pilot offer

Card: "3 months free" on the night tower.

> 3 أشهر مجانًا. نبني نسخة ثلاثية الأبعاد من مزرعتك خلال أسبوعين تقريبًا، وتتواصل معي مباشرة عبر واتساب. نستقبل عددًا قليلًا من المزارع في الأردن والخليج.
>
> 3 months free. We build a 3D twin of your farm in about two weeks, and you talk to me directly on WhatsApp. A few farms in Jordan and the Gulf.
>
> #التقنيات_الزراعية #AgTech #Jordan #GCC

## More Reel ideas

Each is a screen recording of the live demo, 10 to 20 seconds, vertical, with no voice (text on screen in both languages):

1. **From a name to a farm:** type a farm name on the homepage; the demo opens carrying it.
2. **Day to night in 10 seconds:** drag the clock; the sun sets and the grow lights take over.
3. **One floor up close:** tap a floor; the readings appear above the beds.
4. **One crate's journey:** follow a batch along the seed-to-plate strip.
5. **Four farms in 12 seconds:** tower, container, greenhouse, lab, cut on the beat.
6. **The guided tour:** the demo's tour pointing at each control (shows how easy it is).
7. **Why a designer builds this:** Mikdam talking to camera, 30 seconds (from post 18).

## Stories (when there's something to say)

- A new guide is out: a poll ("Do you know your cost per kg? Yes / Not yet") and a link sticker to the guide.
- A pilot farm starts (with permission): "Welcome, [farm name]" over a still of their twin.
- Behind the scenes: a sketch of a farm layout becoming its 3D twin.
