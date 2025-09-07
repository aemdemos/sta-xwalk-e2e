/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the teaser block (main content)
  let teaser = null;
  for (const child of children) {
    if (child.classList.contains('cmp-teaser')) {
      teaser = child;
      break;
    }
  }
  if (!teaser) return;

  // Get image block
  let imageCell = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Defensive: find the img element inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      // fallback: use the whole imageWrapper if no img
      imageCell = imageWrapper;
    }
  }

  // Get content block
  let contentCell = null;
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Gather title, description, CTA
    const contentParts = [];
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    const actionContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      // Only include the link, not the container
      const link = actionContainer.querySelector('a');
      if (link) contentParts.push(link);
    }
    contentCell = contentParts;
  }

  // Compose table rows
  const headerRow = ['Hero (hero8)'];
  const imageRow = [imageCell];
  const contentRow = [contentCell];
  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
