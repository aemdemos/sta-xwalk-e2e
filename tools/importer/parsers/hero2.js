/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image (background image)
  let imageEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the main heading (title)
  let headingEl = element.querySelector('h1');

  // Find subheading and CTA (future-proof, but not present in this example)
  let subheadingEl = null;
  let ctaEl = null;
  if (headingEl) {
    let next = headingEl.nextElementSibling;
    while (next) {
      if ((/^H[2-6]$/).test(next.tagName) || next.tagName === 'P') {
        if (next.textContent.trim()) {
          subheadingEl = next;
          break;
        }
      }
      next = next.nextElementSibling;
    }
    // Look for CTA (a link) after heading or subheading
    next = subheadingEl ? subheadingEl.nextElementSibling : headingEl.nextElementSibling;
    while (next) {
      const link = next.querySelector && next.querySelector('a');
      if (link) {
        ctaEl = link;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // Compose the content cell for row 3: always include title, subheading, CTA (if present)
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl && subheadingEl !== headingEl) contentCell.push(subheadingEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Table rows: always 3 rows (header, image, content)
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl || ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Ensure exactly 3 rows, even if content is missing
  const rows = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
