/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser content and image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Build the header row
  const headerRow = ['Columns (columns40)'];

  // Build the columns row: [image, content]
  // Use the entire image container and content container as cells
  const columnsRow = [
    teaserImage,
    teaserContent
  ];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
