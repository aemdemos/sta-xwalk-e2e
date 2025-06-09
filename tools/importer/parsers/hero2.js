/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content container inside the hero block
  // This block is usually: .hero-wrapper > .hero > div > div
  let contentDiv = element.querySelector('.hero-wrapper .hero > div > div');
  if (!contentDiv) {
    // fallback for slight variations
    contentDiv = element.querySelector('.hero-wrapper .hero > div');
  }
  if (!contentDiv) {
    contentDiv = element;
  }

  // Find the <picture> element for the image, if present
  let pictureEl = null;
  const pictureP = contentDiv.querySelector('picture');
  if (pictureP) {
    pictureEl = pictureP;
  }

  // Collect all heading and paragraph elements under contentDiv, in appearance order
  // We'll allow for: h1, h2, h3, h4, h5, h6, p
  const contentNodes = [];
  for (const node of contentDiv.children) {
    // skip the picture-containing <p> if we already grabbed it
    if (node.querySelector && node.querySelector('picture') && pictureEl) {
      continue;
    }
    if (node.tagName.match(/^H[1-6]$/) || node.tagName === 'P') {
      // Only append if not empty
      if (node.textContent.trim().length > 0) {
        contentNodes.push(node);
      }
    }
  }

  // Table rows as per the "Hero" block (Header, Image, Text)
  const headerRow = ['Hero'];
  const imageRow = [pictureEl || ''];
  // The text row: if we have any heading or p, otherwise blank
  const textRow = [contentNodes.length ? contentNodes : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow
  ], document);

  element.replaceWith(table);
}
