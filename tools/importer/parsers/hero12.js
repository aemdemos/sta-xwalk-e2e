/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block (teaser)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image (background image)
  let imageEl = null;
  const teaserImage = teaser.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    imageEl = teaserImage.querySelector('img');
  }

  // Find the content (title, subheading, etc.)
  const content = teaser.querySelector('.cmp-teaser__content');
  let contentDiv = document.createElement('div');
  if (content) {
    // Move all children (e.g., h2) into the new div, preserving semantics
    Array.from(content.childNodes).forEach((node) => {
      contentDiv.appendChild(node.cloneNode(true));
    });
  }

  // Build the table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentDiv];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
