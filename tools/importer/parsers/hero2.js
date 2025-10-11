/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Get the image (picture) element
  let pictureEl = element.querySelector('picture');
  if (!pictureEl) {
    // Defensive: look for image if picture is missing
    const imgEl = element.querySelector('img');
    if (imgEl) {
      pictureEl = document.createElement('picture');
      pictureEl.appendChild(imgEl);
    }
  }

  // Get the main heading (h1)
  let headingEl = element.querySelector('h1');
  // Defensive: fallback to first <p> if no heading
  if (!headingEl) {
    headingEl = element.querySelector('p');
  }

  // Build table rows
  const headerRow = ['Hero (hero2)'];

  // Row 2: Image
  let imageCell = '';
  if (pictureEl) {
    imageCell = fieldFragment('image', pictureEl);
  }

  // Row 3: Text (headline)
  let textCell = '';
  if (headingEl && headingEl.textContent.trim()) {
    // Only use actual text content for text field
    const textEl = document.createElement('div');
    textEl.textContent = headingEl.textContent.trim();
    textCell = fieldFragment('text', textEl);
  }

  // Build table
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
