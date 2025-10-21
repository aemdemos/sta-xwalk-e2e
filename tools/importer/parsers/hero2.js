/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the image (picture element)
  let pictureEl = element.querySelector('picture');
  // Defensive: if not found, look for img
  if (!pictureEl) {
    const imgEl = element.querySelector('img');
    if (imgEl) {
      pictureEl = document.createElement('picture');
      pictureEl.appendChild(imgEl);
    }
  }

  // Find the main heading (h1)
  let headingEl = element.querySelector('h1');
  // Defensive: if not found, look for h2
  if (!headingEl) {
    headingEl = element.querySelector('h2');
  }
  // Defensive: if not found, look for first p with text
  if (!headingEl) {
    headingEl = Array.from(element.querySelectorAll('p')).find(p => p.textContent.trim().length > 0);
  }
  // If still not found, create an empty paragraph
  if (!headingEl) {
    headingEl = document.createElement('p');
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [pictureEl ? fieldCell('image', pictureEl) : ''];
  const textRow = [headingEl ? fieldCell('text', headingEl) : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
