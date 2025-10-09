/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (image field)
  let imageCell = null;
  // Find the <img> inside a <picture>
  const img = element.querySelector('img');
  if (img) {
    // Use the existing <picture> parent for the image
    const picture = img.closest('picture');
    if (picture) {
      // Wrap with field comment for 'image'
      imageCell = fieldFragment('image', picture);
    }
  }

  // 3. Text row (text field)
  let textCell = null;
  // Find the main heading (h1)
  const h1 = element.querySelector('h1');
  if (h1) {
    textCell = fieldFragment('text', h1);
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
