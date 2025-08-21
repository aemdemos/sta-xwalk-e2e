/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the .hero.block (may be nested)
  const block = element.querySelector('.hero.block');
  // Safety fallback: if not found, just use the element
  const blockContent = block ? block : element;

  // The main content is inside blockContent > div > div, but fallback to blockContent
  let main = blockContent.querySelector('div > div');
  if (!main) main = blockContent;

  // Get image (background image)
  // Look for <picture> or <img>
  let imageEl = null;
  // Find the first <picture> containing an <img>
  const picture = main.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // fallback: image only
    const img = main.querySelector('img');
    if (img) imageEl = img;
  }

  // Get headline (first h1-h6)
  let headline = null;
  for (let i = 1; i <= 6; i++) {
    const h = main.querySelector(`h${i}`);
    if (h) {
      headline = h;
      break;
    }
  }

  // Get subheading (first h2-h6 after headline)
  let subheading = null;
  if (headline) {
    let next = headline.nextElementSibling;
    while (next) {
      if (/^H[2-6]$/.test(next.tagName)) {
        subheading = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // Get additional rich text (paragraphs, etc.) after heading/subheading
  const textElements = [];
  let lastHeading = subheading || headline;
  if (lastHeading) {
    let next = lastHeading.nextElementSibling;
    while (next) {
      // Stop at next heading
      if (/^H[1-6]$/.test(next.tagName)) break;
      if (next.tagName === 'P' && next.textContent.trim()) {
        textElements.push(next);
      }
      next = next.nextElementSibling;
    }
  }

  // Compose the table rows
  const cells = [];
  // 1. Header row
  cells.push(['Hero']); // as specified

  // 2. Image row
  cells.push([imageEl ? imageEl : '']);

  // 3. Content row: headline, subheading, and rich text
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (subheading) contentCell.push(subheading);
  if (textElements.length) contentCell.push(...textElements);
  cells.push([contentCell]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
