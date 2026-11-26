# Rashid & Finshila · Wedding Invitation

A static site (no build step). Open `index.html` through any web server, or deploy the folder as is (e.g. Vercel).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Theme: ivory palette, Cormorant Garamond + Pinyon Script, petal backgrounds |
| `app.js` | Opening sequence, countdown, calendar, program, RSVP, music, scroll reveal |
| `config.js` | **All wedding details and options. Edit this file.** |
| `Code.gs` | Optional Google Apps Script that saves RSVPs to a Google Sheet |
| `assets/` | `opening.jpg` + `envelop.mp4` (opening), `hero.mp4` + `couple-poster.jpg` (couple video), `hero.png`, `band-1/2.jpg` (petal backgrounds) |
| `og.jpg` | Link-preview image |

## Common edits (all in `config.js`)

- **RSVP responses:** set `rsvpScriptUrl` (deploy `Code.gs` as a Web App; steps are in its header) *or* `rsvpWhatsApp` (e.g. `"919876543210"`). With neither set, guests only see a thank-you message and nothing is collected.
- **Gift list:** set `giftUrl`. While empty, the link is hidden.
- **Music:** put an mp3 in `assets/` and set `music: "assets/your-song.mp3"`. While empty, there is no music button.
- **Photos:** add images to `assets/` and list them in `gallery` (up to 4). With none, the Moments section is hidden. To use a photo instead of the couple video in the arch frame, set `portraitVideo: ""` and `portrait: "assets/photo.jpg"`.
- **Map links:** each event gets an automatic Google Maps search link; add `mapUrl` to an event to use an exact link, or `mapUrl: ""` to hide it.
- **Event times:** none are shown. The countdown targets `countdownTo` (Nikkah, 10:00 IST).
