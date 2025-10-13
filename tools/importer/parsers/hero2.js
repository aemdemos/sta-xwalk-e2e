/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a field comment fragment
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Table header row
  const headerRow = ['Hero (hero2)'];

  // Find hero image (picture element)
  let pictureEl = null;
  // Defensive: look for a picture inside a p
  const pictures = element.querySelectorAll('picture');
  if (pictures.length > 0) {
    pictureEl = pictures[0];
  }

  // Find hero headline (h1)
  let headlineEl = null;
  const h1s = element.querySelectorAll('h1');
  if (h1s.length > 0) {
    headlineEl = h1s[0];
  }

  // --- Row 2: Image ---
  let imageCell = null;
  if (pictureEl) {
    // Only add field comment for non-collapsed field (image)
    imageCell = fieldFragment('image', pictureEl);
  } else {
    imageCell = '';
  }

  // --- Row 3: Headline text ---
  let textCell = null;
  if (headlineEl) {
    textCell = fieldFragment('text', headlineEl);
  } else {
    textCell = '';
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with block
  element.replaceWith(block);
}
