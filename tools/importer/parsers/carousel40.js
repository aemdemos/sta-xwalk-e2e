/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser content and image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Defensive: get the image element (first img inside teaserImage)
  let imgEl = null;
  if (teaserImage) {
    imgEl = teaserImage.querySelector('img');
  }

  // Defensive: build the text cell content
  const textContent = [];
  if (teaserContent) {
    // Optional pretitle
    const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);
    // Title (as heading)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA (link)
    const action = teaserContent.querySelector('.cmp-teaser__action-link');
    if (action) textContent.push(action);
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel40)'];
  const rows = [headerRow];

  // Only add a slide if we have an image
  if (imgEl) {
    rows.push([
      imgEl,
      textContent.length ? textContent : ''
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
