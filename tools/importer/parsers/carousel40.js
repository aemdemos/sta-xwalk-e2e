/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (could be the element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Find image (first cell)
  let imageCell = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find text content (second cell)
  const content = teaser.querySelector('.cmp-teaser__content');
  let textCellContent = [];
  if (content) {
    // Optional pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle);
    // Title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    // CTA (button or link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) textCellContent.push(cta);
  }

  // Compose the table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageCell, textCellContent];
  const cells = [headerRow, slideRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
