/* The invitation's details. Edit here; the page fills itself in from this file. */
window.INVITE = {
  groom: "Rashid",
  bride: "Finshila",
  monogram: "RF",

  /* Countdown target (Nikkah). Format: "YYYY-MM-DDTHH:MM:00+05:30". Leave "" to hide the countdown. */
  countdownTo: "2026-12-26T10:00:00+05:30",

  /* Events, shown in this order. date: "YYYY-MM-DD".
     mapUrl: leave out for an automatic Google Maps search of the venue, paste your own link,
     or set to "" to hide the map link. */
  events: [
    { name: "Nikkah",    date: "2026-12-26", venue: "MMO Auditorium", place: "Mukkam" },
    { name: "Reception", date: "2026-12-27", venue: "MM Royal Grand", place: "Kizhuparamba" }
  ],

  groomParents: "Mr Beeran KT and Mrs Bushrath NT",
  brideParents: "Mr Ali and Mrs Sulaikha",

  rsvpDeadline: "30 November 2026",

  /* RSVP destination. Use ONE of these:
     - rsvpScriptUrl: Google Apps Script Web App URL (see Code.gs and README.md); answers land in a Google Sheet.
     - rsvpWhatsApp: number with country code, e.g. "919876543210"; the answer opens as a WhatsApp message.
     With neither set, guests just see a thank-you message and nothing is collected. */
  rsvpScriptUrl: "",
  rsvpWhatsApp: "",

  /* Gift list link. "" hides the link. */
  giftUrl: "",

  /* Background music. Drop a file next to index.html (e.g. "assets/music.mp3") and set the path here.
     "" = no music button. */
  music: "assets/reel.mp3",

  /* Couple video shown in the arch frame (leave "" to use a photo instead). */
  portraitVideo: "assets/hero.mp4",
  portraitPoster: "assets/couple-poster.jpg",
  /* Photo for the arch frame, used only when portraitVideo is "". */
  portrait: "",
  /* Gallery photos, e.g. ["assets/photo1.jpg", ...]. Up to 4 are shown; with none, the Moments section is hidden. */
  gallery: []
};
