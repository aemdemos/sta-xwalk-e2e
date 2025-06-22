/* global WebImporter */
export default function parse(element, { document }) {
  // This block should only be created if there is a video embed (iframe or external video link) in the element.
  // The provided HTML is a header/navigation bar and does not contain any video embeds or images to use as posters.
  // Therefore, there is nothing to convert to an Embed (embedVideo1) block. 
  // The correct operation is to not create or insert a block for this element.
  return;
}
