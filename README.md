# azrillresume.github.io

Personal portfolio and résumé site of **Azrill Muhammad Hakimi**. It is a plain static site (no build step, no frameworks), deployed to GitHub Pages by `.github/workflows/static.yml` whenever `main` is updated.

## What's where

| Path | What it is |
| --- | --- |
| `index.html` | All the page text: hero, about, skills, education, experience, certificates, contact |
| `assets/js/portfolio-data.js` | **Photo albums and videos** — edit this to add or change them |
| `assets/css/style.css` | The design: colours, fonts, layout, animations |
| `assets/js/main.js` | The interactions: scroll effects, gallery, theme switch |
| `assets/img/albums/` | Album photos (small previews live in `thumbs/`) |
| `assets/img/videos/` | Video thumbnails |
| `assets/img/logos/`, `assets/img/portrait.webp` | Logos and the portrait photo |
| `Azrill Resume.pdf`, `*_cert.pdf` | The downloadable résumé and certificates |

## Common edits

**Update the résumé** — replace `Azrill Resume.pdf` with a new file of the same name, then update the "Updated March 2026" note near the bottom of `index.html`.

**Add a photo to an album**

1. Upload the photo to `assets/img/albums/`.
2. Open `assets/js/portfolio-data.js` and add a line to that album's `images` list:
   ```js
   { file: 'MyPhoto.jpg', caption: 'What is happening in the photo' },
   ```

**Add a new album** — copy one whole `{ ... }` album block in `portfolio-data.js`, paste it after the last one and change the text. The card on the page is created automatically.

**Add a video** — add a line to `videos` in `portfolio-data.js`. `id` is the code at the end of the YouTube link (`youtube.com/watch?v=THIS_PART`).

**Change the colours** — the palette is the block of `--variables` at the top of `assets/css/style.css` (one set for the light theme, one for dark).

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
