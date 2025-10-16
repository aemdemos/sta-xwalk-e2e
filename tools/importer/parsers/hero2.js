/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (field: image)
  // Find the image (inside <picture> or <img>)
  let imgPicture = element.querySelector('picture');
  let imgElem = imgPicture ? imgPicture.querySelector('img') : null;
  let imageCell = '';
  if (imgPicture && imgElem) {
    // Use the existing <picture> element as is (it includes <img> with alt)
    imageCell = fieldFragment('image', imgPicture);
  }

  // 3. Text row (field: text)
  // Find the main heading (h1) and any additional text (none in this case)
  let textCell = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    textCell = fieldFragment('text', h1);
  }

  // Table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
