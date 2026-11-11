/* ==========================================================================
   PORTFOLIO CONTENT — edit this file to add photos, albums or videos.
   The page builds the album cards, galleries and video grid from it.

   ADD A PHOTO
     1. Upload the image into  assets/img/albums/
     2. Add a line to the album's "images" list:
          { file: 'MyPhoto.jpg', caption: 'What is happening in the photo' },
        (A small preview in assets/img/albums/thumbs/ is optional — if there
        isn't one, the full photo is used automatically.)

   ADD AN ALBUM
     Copy one whole { ... } album block, paste it after the last one and
     change the text. "cover" picks the three photos shown on the card
     (leave it out to use the first three).

   ADD A VIDEO
     Add a line to "videos". "id" is the code at the end of the YouTube link
     (youtube.com/watch?v=THIS_PART). "poster" is the thumbnail image.
   ========================================================================== */

window.PORTFOLIO = {
  albums: [
    {
      category: 'Internship / Experience',
      title: 'MIROS Internship Experience',
      blurb: 'Five months with the Human Resources unit at the Malaysia Institute of Road Safety Research, May to September 2023.',
      cover: ['M3.jpeg', 'M6.jpeg', 'M2.jpeg'],
      images: [
        { file: 'M2.jpeg', w: 1080, h: 958, caption: 'Hari Raya Day team picture' },
        { file: 'M3.jpeg', w: 1080, h: 792, caption: 'HRM and Accounting team picture' },
        { file: 'M4.jpeg', w: 750, h: 1000, caption: 'MIROS office' },
        { file: 'M5.jpeg', w: 1280, h: 960, caption: 'Gifting' },
        { file: 'M6.jpeg', w: 1280, h: 960, caption: 'End of OJT certificate ceremony with all of the HRM team' },
        { file: 'M7.jpeg', w: 960, h: 1280, caption: 'End of OJT certificate given by Puan Raudha, the HRM Head of Unit' },
        { file: 'M8.jpeg', w: 768, h: 1020, caption: 'Assisting in a health check event' },
        { file: 'M9.jpeg', w: 960, h: 1280, caption: 'Keying in staff information using the MIROS HR System' },
        { file: 'M12.jpeg', w: 1280, h: 960, caption: 'Assisting in a health check event' },
        { file: 'M13.jpeg', w: 1280, h: 960, caption: 'Creating an organisation chart' },
        { file: 'M14.jpeg', w: 1280, h: 960, caption: 'Recording and writing meeting minutes' },
        { file: 'M16.jpeg', w: 1280, h: 960, caption: 'Assisting in the interview process' },
        { file: 'M17.jpeg', w: 1280, h: 960, caption: 'Assisting in filling in company employee information' },
        { file: 'M18.jpeg', w: 960, h: 1280, caption: 'Using the shredding machine to shred old documents' }
      ]
    },
    {
      category: 'Talks / Invitation',
      title: 'Dialogue with Alumni Program',
      blurb: 'Invited back to Kolej Vokasional Kajang as an alumnus to share my experience with juniors.',
      cover: ['T2.jpg', 'T4.jpg', 'T1.jpg'],
      images: [
        { file: 'T1.jpg', w: 1280, h: 853, caption: 'Giving a talk to fellow juniors' },
        { file: 'T2.jpg', w: 1280, h: 853, caption: 'With KV Kajang Deputy Academic Director, Puan Faridah' },
        { file: 'T3.jpg', w: 1280, h: 853, caption: 'With the other alumni' },
        { file: 'T4.jpg', w: 1280, h: 853, caption: 'Receiving a certificate from the Head of Business Department, Encik Tajuddin' },
        { file: 'T5.jpg', w: 1280, h: 853, caption: 'Eating with fellow lecturers before the Dialogue starts' },
        { file: 'T6.jpg', w: 963, h: 1280, caption: 'With my fellow alumni, joined by our class lecturer, Puan Nabila' }
      ]
    },
    {
      category: 'Hands-On / Experience',
      title: 'KV Kajang Experience',
      blurb: 'Running a student business from stall to final report, and serving on the student representative council (MPP) 2022/2023.',
      cover: ['K7.jpg', 'K4.jpg', 'K1.jpg'],
      images: [
        { file: 'K1.jpg', w: 1280, h: 960, caption: 'After the business report presentation with my team' },
        { file: 'K2.jpg', w: 960, h: 960, caption: 'Group photo of my business team' },
        { file: 'K3.jpg', w: 960, h: 1280, caption: 'The final business report for our KV business' },
        { file: 'K4.jpg', w: 1280, h: 960, caption: 'My business team with our total sales' },
        { file: 'K5.jpg', w: 1280, h: 853, caption: 'MPP 2022/2023 group photo' },
        { file: 'K6.jpg', w: 832, h: 1280, caption: 'My MPP recognition certificate' },
        { file: 'K7.jpg', w: 1280, h: 960, caption: 'Group photo with my business team' },
        { file: 'K8.jpg', w: 960, h: 1280, caption: 'Setting up shop for the business project' },
        { file: 'K9.jpg', w: 768, h: 1024, caption: 'Another group photo' },
        { file: 'K10.jpg', w: 1280, h: 960, caption: 'One of our customers purchasing our product' },
        { file: 'K11.jpg', w: 1280, h: 960, caption: 'Setting up shop' },
        { file: 'K12.jpg', w: 960, h: 1200, caption: 'Interacting with customers' },
        { file: 'K13.jpg', w: 1280, h: 960, caption: 'Cooking our product' }
      ]
    }
  ],

  videos: [
    {
      id: 'Tr_G1OZrh1w',
      title: 'Digital Operations & Infrastructure Analysis of Bandai Namco Malaysia Studios',
      tag: 'Business analysis',
      poster: 'assets/img/videos/bandai-namco.webp'
    },
    {
      id: 'zVrHpkZ5tm0',
      title: 'Five De-escalation Techniques for Heated Conversations',
      tag: 'Communication & Conflict Management',
      poster: 'assets/img/videos/de-escalation.webp'
    },
    {
      id: 'yZcrIPVaUWk',
      title: 'An International Business Expansion Plan for In-N-Out Burger',
      tag: 'International Business',
      poster: 'assets/img/videos/in-n-out.webp'
    },
    {
      id: 'dv_FwdL7mR8',
      title: 'Wells Fargo: An Organisational Behaviour Presentation',
      tag: 'Organisational Behaviour',
      poster: 'assets/img/videos/wells-fargo.webp'
    }
  ]
};
