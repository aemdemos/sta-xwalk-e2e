/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Get the image (picture or img)
  let imageElem = element.querySelector('picture, img');
  if (!imageElem) {
    // Defensive: try to find any img inside
    imageElem = element.querySelector('img');
  }
  let imageCell = null;
  if (imageElem) {
    // Always wrap in a <picture> if not already
    let picture;
    if (imageElem.tagName.toLowerCase() === 'picture') {
      picture = imageElem;
    } else {
      picture = document.createElement('picture');
      picture.appendChild(imageElem);
    }
    imageCell = fieldFragment('image', picture);
  }

  // 2. Get the main heading and any richtext
  // For Hero (hero2), only one field: text (richtext)
  // Use the actual heading element, not alt text
  let textCell = null;
  // Find h1, h2, h3, h4, h5, h6, p, etc. inside block
  const richElems = [];
  // Only use direct children of the block for text
  Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6, p')).forEach((el) => {
    // Exclude empty paragraphs
    if (el.textContent.trim()) {
      richElems.push(el);
    }
  });
  if (richElems.length > 0) {
    // Compose all richtext into a fragment
    const frag = document.createDocumentFragment();
    richElems.forEach((el) => frag.appendChild(el));
    textCell = fieldFragment('text', frag);
  }

  // Table structure: 1 column, 3 rows
  const headerRow = ['Hero (hero2)'];
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
