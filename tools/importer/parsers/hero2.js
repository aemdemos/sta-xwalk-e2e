/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (may be nested)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // The hero content is typically inside nested divs: heroBlock > div > div
  // Find the deepest (non-empty) div child
  let contentDiv = heroBlock;
  let candidate = contentDiv.querySelector('div > div');
  if (candidate) contentDiv = candidate;

  // Get all direct children
  const directChildren = Array.from(contentDiv.children);

  // Find the first <picture> or <img> as the background image (if any)
  let bgImage = null;
  for (const child of directChildren) {
    const pic = child.querySelector('picture');
    if (pic) {
      bgImage = pic;
      break;
    }
    const img = child.querySelector('img');
    if (img) {
      bgImage = img;
      break;
    }
  }
  // In this HTML, first <p> contains picture
  if (!bgImage) {
    const pic = contentDiv.querySelector('picture');
    if (pic) bgImage = pic;
    else {
      const img = contentDiv.querySelector('img');
      if (img) bgImage = img;
    }
  }
  // For table row, use the actual element node, not a clone

  // Gather text content: select everything except the image/picture
  // Typically h1 and any following non-empty paragraphs
  const textNodes = [];
  for (const child of directChildren) {
    // Skip if this contains the picture/image
    if (bgImage && (child === bgImage || child.contains(bgImage))) continue;
    // If child is empty <p>, skip
    if (child.tagName === 'P' && child.textContent.trim() === '') continue;
    textNodes.push(child);
  }
  // If nothing found, fallback to finding heading
  if (textNodes.length === 0) {
    const fallbackHeading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (fallbackHeading) textNodes.push(fallbackHeading);
  }
  // If still nothing, add empty string
  const textCell = textNodes.length ? textNodes : [''];

  // Compose rows
  const rows = [
    ['Hero'],
    [bgImage ? bgImage : ''],
    [textCell]
  ];

  // Remove the original element and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
