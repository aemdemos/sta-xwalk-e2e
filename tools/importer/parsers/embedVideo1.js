/* global WebImporter */
export default function parse(element, { document }) {
  // This block expects an embed, i.e. an external video URL with optional image.
  // The given HTML is a navigation/header, not an embed. There are no iframes, videos or external embed links in this element.
  // To follow the critical review, we must produce the correct structure, but leave the content row empty if there's nothing to extract.
  const headerRow = ['Embed (embedVideo1)'];
  // Try to find an <iframe> or <video> or any external video link in the element
  // (We expect none in this header markup.)
  let embedUrl = '';
  // Check for iframes or video embeds
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    embedUrl = iframe.src;
  } else {
    // Sometimes embeds are present as simple links to vimeo/youtube etc
    const links = element.querySelectorAll('a');
    for (const a of links) {
      const href = a.href || '';
      if (/youtube|vimeo|youtu\.be/i.test(href)) {
        embedUrl = href;
        break;
      }
    }
  }
  // Optionally, also look for a poster image
  let posterImg = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    // Heuristically, if the image is large or has a video-ish class, treat as poster
    // (But in this HTML, all images are icons or logos. None are suitable.)
    if ((img.width && img.width > 200) || (img.height && img.height > 100)) {
      posterImg = img;
      break;
    }
  }
  // Compose the cell contents:
  let cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (embedUrl) {
    const a = document.createElement('a');
    a.href = embedUrl;
    a.textContent = embedUrl;
    cellContent.push(a);
  }
  if (cellContent.length === 0) cellContent = ['']; // blank cell
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);
  element.replaceWith(table);
}
