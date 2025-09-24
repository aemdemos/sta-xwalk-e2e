/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the innermost hero block
  let heroBlock = element;
  // Find .hero.block if present
  const heroBlockEl = element.querySelector('.hero.block');
  if (heroBlockEl) heroBlock = heroBlockEl;

  // Find the image (background)
  let imageEl = null;
  // Look for <img> inside <picture>
  const pictureEl = heroBlock.querySelector('picture');
  if (pictureEl) {
    imageEl = pictureEl.querySelector('img');
  }
  // Defensive: if not found, look for any <img>
  if (!imageEl) {
    imageEl = heroBlock.querySelector('img');
  }

  // Find the headline (h1, h2, etc.)
  let headingEl = null;
  // Prefer h1
  headingEl = heroBlock.querySelector('h1');
  // Defensive: fallback to h2/h3 if needed
  if (!headingEl) {
    headingEl = heroBlock.querySelector('h2, h3');
  }

  // Find subheading and CTA (not present in this HTML, but support for future)
  // Subheading: look for h2/h3 after headingEl
  let subheadingEl = null;
  if (headingEl) {
    // Next element sibling that's a heading
    let next = headingEl.nextElementSibling;
    while (next) {
      if (/^H[2-6]$/.test(next.tagName)) {
        subheadingEl = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // CTA: look for <a> inside heroBlock
  let ctaEl = null;
  ctaEl = heroBlock.querySelector('a');

  // Compose content cell for row 3
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  // Optionally add CTA
  if (ctaEl) contentCell.push(ctaEl);

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
