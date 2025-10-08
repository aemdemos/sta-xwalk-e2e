/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with field comment and content
  function fieldFragment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get the image (background)
  let imgEl = element.querySelector('img');
  let pictureEl = imgEl ? imgEl.closest('picture') : null;
  let imageCell = null;
  if (pictureEl) {
    // Use the picture element directly, no field comment for collapsed fields
    imageCell = fieldFragment('image', pictureEl);
  }

  // Get the headline text (h1)
  let headingEl = element.querySelector('h1');
  let textCell = null;
  if (headingEl) {
    textCell = fieldFragment('text', headingEl);
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageCell];
  const textRow = [textCell];

  const rows = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
