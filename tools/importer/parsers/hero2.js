/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Create field comment + content fragment
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (image field)
  let imageCell = null;
  // Find the first <img> inside a <picture>
  const img = element.querySelector('img');
  if (img && img.closest('picture')) {
    // Use the existing <picture> element
    const picture = img.closest('picture');
    // Wrap with field comment for 'image' (do NOT add for imageAlt)
    imageCell = fieldFragment('image', picture);
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

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
