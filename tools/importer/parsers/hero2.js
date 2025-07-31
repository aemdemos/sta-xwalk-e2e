/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block (may be deeply nested)
  let heroInner = element.querySelector('.hero.block > div > div') || element.querySelector('.hero.block') || element;

  // Get background image (the first picture/img inside heroInner)
  let bgImage = null;
  let picture = heroInner.querySelector('picture');
  if (picture) {
    bgImage = picture;
  } else {
    let img = heroInner.querySelector('img');
    if (img) bgImage = img;
  }

  // Collect all elements for the 'text block' (headings, paragraphs, links), skipping the picture
  let textEls = [];
  for (let child of heroInner.children) {
    // skip if this is/contains the background image
    if (picture && (child === picture || child.contains(picture))) continue;
    // skip empty paragraphs
    if (child.tagName === 'P' && !child.textContent.trim()) continue;
    // Only push child if it has meaningful content
    if (child.textContent.trim()) {
      textEls.push(child);
    }
  }

  // If no text elements found, fallback to any headings or paragraphs after the image
  if (textEls.length === 0) {
    let foundImg = false;
    for (let child of heroInner.children) {
      if (child === picture) { foundImg = true; continue; }
      if (!foundImg) continue;
      if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P') {
        if (child.textContent.trim()) textEls.push(child);
      }
    }
  }

  const cells = [
    ['Hero'],
    [bgImage ? bgImage : ''],
    [textEls.length > 1 ? textEls : (textEls[0] || '')],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
