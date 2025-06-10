/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first image (picture) and its containing <p>
  const picture = element.querySelector('picture');
  let imageCell = '';
  if (picture) {
    imageCell = picture.closest('p') || picture;
  }

  // Find all heading and paragraph nodes (h1, h2, h3, p) after the image
  let contentCell = '';
  // The content is inside the same div as the image and headings
  let contentDiv = null;
  if (picture) {
    contentDiv = picture.closest('div');
  } else {
    // fallback: try to grab innermost div with headings
    contentDiv = element.querySelector('h1, h2, h3, p')?.closest('div');
  }
  if (contentDiv) {
    // Get all direct children (preserving order)
    const contentNodes = Array.from(contentDiv.children).filter(node => {
      // Only headings and paragraphs
      return ['H1','H2','H3','P'].includes(node.tagName);
    });
    // Remove empty paragraph nodes
    const filtered = contentNodes.filter(n => n.tagName !== 'P' || n.textContent.trim() !== '');
    if (filtered.length > 0) {
      contentCell = filtered;
    } else {
      contentCell = '';
    }
  }

  // Build the cells for the table
  const cells = [
    ['Hero'],
    [imageCell],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
