/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (content) frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (image field)
  let imageCell = null;
  // Find the <img> inside a <picture>
  const img = element.querySelector('img');
  if (img) {
    // Use the parent <picture> if present
    const pic = img.closest('picture') || img;
    imageCell = fieldCell('image', pic);
  }

  // 3. Text row (text field)
  let textCell = null;
  // Find the main heading (h1) or other text
  const h1 = element.querySelector('h1');
  if (h1) {
    textCell = fieldCell('text', h1);
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
