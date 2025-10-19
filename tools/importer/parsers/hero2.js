/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with the required field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Extract image (background image)
  // Find the first <img> inside the block
  let imgEl = element.querySelector('img');
  let imageCell = '';
  if (imgEl) {
    // Use the <picture> parent if available for better fidelity
    let picture = imgEl.closest('picture');
    let pictureClone = picture ? picture.cloneNode(true) : imgEl.cloneNode(true);
    imageCell = fieldFragment('image', pictureClone);
  }

  // 3. Extract text (main heading)
  // Find the first heading (h1, h2, etc.) inside the block
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  let textCell = '';
  if (heading) {
    // Wrap the heading in a fragment with the required field comment
    textCell = fieldFragment('text', heading.cloneNode(true));
  }

  // 4. Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
