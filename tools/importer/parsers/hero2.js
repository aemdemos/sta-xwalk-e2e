/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the image (picture/img)
  let imgEl = element.querySelector('img');
  let pictureEl = imgEl ? imgEl.closest('picture') : null;
  // Defensive: If no picture, try to find any img
  if (!pictureEl && imgEl) {
    pictureEl = imgEl;
  }
  // Defensive: If no image, leave cell empty
  let imageCell = null;
  if (pictureEl) {
    imageCell = fieldFragment('image', pictureEl);
  }

  // Find the main heading (h1)
  let headingEl = element.querySelector('h1');
  let textCell = null;
  if (headingEl) {
    textCell = fieldFragment('text', headingEl);
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageCell];
  const textRow = [textCell];

  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
