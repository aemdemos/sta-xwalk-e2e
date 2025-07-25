/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Hero'];

  // Find the first <picture> element for the background image (if any)
  const pictureEl = element.querySelector('picture');
  const imageRow = [pictureEl ? pictureEl : ''];

  // Collect hero text content: heading, subheading, CTA, etc.
  // We'll look inside the hero block for the first heading and content after it
  let contentEls = [];
  // Prefer to search inside the most nested hero block if present
  let contentContainer = element;
  const heroBlock = element.querySelector('.hero.block');
  if (heroBlock) {
    contentContainer = heroBlock;
  }
  // Find the main heading (h1-h6)
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    contentEls.push(heading);
    // Collect immediate sibling elements that are typical hero content: p, h2-6
    let next = heading.nextElementSibling;
    while (next) {
      // Only add non-empty p or h2-6
      if ((next.tagName === 'P' || (/H[2-6]/.test(next.tagName))) && next.textContent.trim()) {
        contentEls.push(next);
      }
      next = next.nextElementSibling;
    }
  }
  // Edge case: If no heading found, gather all text content (p, h1-h6) except picture
  if (!heading) {
    Array.from(contentContainer.querySelectorAll('p, h1, h2, h3, h4, h5, h6')).forEach(el => {
      // Exclude picture's <p> if it contains it
      if (!pictureEl || !pictureEl.closest('p') || el !== pictureEl.closest('p')) {
        if (el.textContent.trim()) contentEls.push(el);
      }
    });
  }
  // Always create the content row, even if empty
  const contentRow = [contentEls.length === 1 ? contentEls[0] : contentEls];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
