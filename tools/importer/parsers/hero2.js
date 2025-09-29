/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first img (background image)
  function findImage(el) {
    const imgs = el.querySelectorAll('img');
    return imgs.length > 0 ? imgs[0] : null;
  }

  // Helper to find the main heading (h1, h2, etc.)
  function findHeading(el) {
    for (let i = 1; i <= 6; i++) {
      const h = el.querySelector(`h${i}`);
      if (h) return h;
    }
    return null;
  }

  // 1. Find the relevant content inside the block
  // Defensive: find the deepest div with an h1 or img
  let contentDiv = element;
  let candidate = element;
  while (candidate && candidate.querySelector('div')) {
    const next = candidate.querySelector('div');
    if (!next) break;
    candidate = next;
    // If this div contains an h1 or img, use it
    if (candidate.querySelector('h1, img')) {
      contentDiv = candidate;
    }
  }

  // 2. Get the background image (optional)
  const img = findImage(contentDiv);
  let imgEl = null;
  if (img) {
    // Use the parent <picture> if available for responsive images
    imgEl = img.closest('picture') || img;
  }

  // 3. Get the heading (optional)
  const heading = findHeading(contentDiv);

  // 4. Get subheading, CTA, etc. (not present in this example)
  // For this block, only heading is present

  // 5. Build the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [heading ? heading : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
