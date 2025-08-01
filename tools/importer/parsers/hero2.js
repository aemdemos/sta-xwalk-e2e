/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner hero content div that contains the main hero content
  let heroContentDiv = element.querySelector('.hero-wrapper .hero.block > div > div');
  if (!heroContentDiv) {
    // fallback to direct child if needed
    heroContentDiv = element.querySelector('.hero.block > div > div') || element;
  }

  // Find picture (or fallback to img)
  let imgEl = null;
  // Look for <picture> inside a <p> as in the example
  const pictureP = Array.from(heroContentDiv.children).find((child) =>
    child.querySelector && child.querySelector('picture')
  );
  if (pictureP) {
    imgEl = pictureP.querySelector('picture');
  } else {
    // If no picture, look for first <img>
    imgEl = heroContentDiv.querySelector('img');
  }

  // Now gather the content elements for row 3 (headline, subheading, cta, etc)
  // We'll include all non-picture children (including h1, p, etc.)
  const contentNodes = [];
  for (const child of heroContentDiv.children) {
    // If this is the <p> with the <picture> or an <img> only, skip it
    if (child === pictureP) continue;
    if (child.tagName === 'PICTURE' || child.tagName === 'IMG') continue;
    // Only push non-empty elements
    // But allow empty <h1> as it could be semantically important
    if (child.textContent.trim() === '' && child.tagName !== 'H1' && child.tagName !== 'H2') continue;
    contentNodes.push(child);
  }

  // Compose the table cells: header, image, text content
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentNodes.length ? contentNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
