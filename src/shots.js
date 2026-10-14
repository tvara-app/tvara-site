/* Store screenshots, shown on /features. One list feeds the gallery, the
   SoftwareApplication screenshots and the image sitemap. Alt says what the
   picture shows; the caption says why it matters. */
export const SHOTS = [
  {
    file: "1-hero",
    alt: "Tvara's minimap along the right edge of a 1,500-message AI conversation, with its toolbar of outline, search and export buttons below it",
    caption: "The speed engine and minimap on a 1,500-message chat. Nothing is deleted.",
  },
  {
    file: "3-search",
    alt: "Tvara's in-chat search finding the word “recurring” in a long AI conversation, on match 1 of 251, with the matching message outlined",
    caption: "In-chat search: every match in the conversation open in front of you.",
  },
  {
    file: "7-recall",
    alt: "Total Recall search for “webhook signature” returning three saved chats, from ChatGPT, Claude and Gemini, stored on this device only",
    caption: "Total Recall (Pro): search the chats you opened before, across supported sites.",
  },
  {
    file: "8-bridge",
    alt: "Context Bridge listing passages from earlier ChatGPT, Claude and Gemini chats, with two ticked to insert into the prompt being written",
    caption: "Context Bridge (Pro): bring answers from past chats into the prompt you are writing.",
  },
  {
    file: "6-popup-trial",
    alt: "The Tvara popup: 1,492 messages asleep, allowance status for each AI account, and switches for the speed engine, minimap, timestamps and allowance tracking",
    caption: "The popup: what is asleep, what each account has left, and every switch.",
  },
];
export const SHOT_W = 1280, SHOT_H = 800;
