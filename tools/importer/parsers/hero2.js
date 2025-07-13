/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block's main content
  // The structure is: .section.hero-container > .hero-wrapper > .hero.block > div > div
  let heroWrapper = element.querySelector('.hero-wrapper');
  if (!heroWrapper) heroWrapper = element;
  let heroBlock = heroWrapper.querySelector('.hero.block');
  if (!heroBlock) heroBlock = heroWrapper;
  // Find the innermost content container
  let contentContainer = heroBlock.querySelector('div > div');
  if (!contentContainer) contentContainer = heroBlock;

  // Find the image (picture or img), allow for it being inside a <p>
  let imgEl = null;
  // Try to find picture or img in first level children
  for (const node of contentContainer.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'PICTURE' || node.tagName === 'IMG') {
        imgEl = node;
        break;
      }
      // If picture or img is inside a <p>
      const pic = node.querySelector && node.querySelector('picture, img');
      if (pic) {
        imgEl = pic;
        break;
      }
    }
  }

  // Collect all text elements after the image for the content row
  let contentNodes = [];
  let foundImage = false;
  for (const node of contentContainer.childNodes) {
    if (!foundImage) {
      if (node === imgEl) {
        foundImage = true;
        continue;
      }
      // If picture/img is inside a <p>
      if (node.nodeType === Node.ELEMENT_NODE && node.querySelector) {
        if (node.querySelector('picture, img') === imgEl) {
          foundImage = true;
          continue;
        }
      }
    } else {
      // Only add non-empty elements and not empty <p>
      if (node.nodeType === Node.ELEMENT_NODE && (node.textContent || '').trim()) {
        contentNodes.push(node);
      }
    }
  }
  // If nothing found after image, as a fallback, collect all heading elements
  if (contentNodes.length === 0) {
    const possibleHeadings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const h of possibleHeadings) {
      contentNodes.push(h);
    }
  }
  // Remove empty <p> nodes
  contentNodes = contentNodes.filter((n) => !(n.tagName === 'P' && !(n.textContent || '').trim()));

  // Build the table
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentNodes.length > 0 ? contentNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
