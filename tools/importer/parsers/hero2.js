/* global WebImporter */
export default function parse(element, { document }) {
  // The block table must have 1 col and 3 rows, with the header 'Hero' as in the example.
  // The second row is the image, third row is the block's textual content (heading, etc.)

  // Step 1: Get the main hero block content div
  // .section.hero-container > .hero-wrapper > .hero.block > div > div
  let contentArea;
  const heroBlock = element.querySelector('.hero.block');
  if (heroBlock) {
    // Look for the deepest child div that contains the actual block content
    let inner = heroBlock.querySelector(':scope > div');
    if (inner) {
      contentArea = inner.querySelector(':scope > div') || inner;
    } else {
      contentArea = heroBlock;
    }
  } else {
    contentArea = element;
  }

  // Step 2: Find all child nodes that are elements and not empty
  const children = Array.from(contentArea.childNodes).filter(n => {
    if (n.nodeType === 1) return true;
    if (n.nodeType === 3) return n.textContent.trim().length > 0;
    return false;
  });

  // Step 3: Find the image cell
  let imageCell = '';
  for (const child of children) {
    if (child.nodeType === 1 && child.tagName === 'P') {
      // Look for a <picture> or <img> inside this <p>
      if (child.querySelector('picture, img')) {
        imageCell = child;
        break;
      }
    }
  }
  // If not found in <p>, look for a <picture> or <img> directly
  if (!imageCell) {
    for (const child of children) {
      if (child.nodeType === 1 && (child.tagName === 'PICTURE' || child.tagName === 'IMG')) {
        imageCell = child;
        break;
      }
    }
  }
  // If still not found, leave as ''

  // Step 4: Gather all block text content after the image
  // We'll include all headings and paragraphs (except the image paragraph)
  let afterImage = false;
  let textNodes = [];
  for (const child of children) {
    if (child === imageCell) {
      afterImage = true;
      continue;
    }
    if (!afterImage && imageCell) continue;
    // Only consider elements that are headings or paragraphs
    if (
      child.nodeType === 1 &&
      (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P')
    ) {
      // Only include non-empty paragraphs or all headings
      if (child.tagName !== 'P' || child.textContent.trim().length > 0 || child.querySelector('img, picture')) {
        textNodes.push(child);
      }
    }
  }

  // Step 5: Build the table rows as in the example
  const cells = [
    ['Hero'],
    [imageCell],
    [textNodes]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
