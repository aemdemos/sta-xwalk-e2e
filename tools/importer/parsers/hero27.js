/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content/image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Row 1: Block name header
  const headerRow = ['Hero (hero27)'];

  // Row 2: Background image (optional)
  let imageRow = [''];
  if (teaserImage) {
    // Use the entire image container so all markup is preserved
    imageRow = [teaserImage];
  }

  // Row 3: Title, description, CTA
  // We'll collect the title, description, and CTA link if present
  const contentParts = [];
  if (teaserContent) {
    // Title (h2)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (div)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA (link)
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts];

  // Compose the table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
