/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with field comment and content
  function fieldFragment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (image field)
  // Find the first <img> inside the element
  let imgElem = element.querySelector('img');
  let imageCell = '';
  if (imgElem) {
    // Find the closest <picture> to preserve responsive sources
    let picture = imgElem.closest('picture');
    let pictureElem = picture ? picture : imgElem;
    // Wrap in fragment with field comment
    imageCell = fieldFragment('image', pictureElem);
  }

  // 3. Text row (text field)
  // Find the main heading (h1, h2, etc) and any paragraphs that are not just the image
  let textCell = '';
  // Find the deepest block with text (usually h1)
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  // Sometimes there may be additional text (paragraphs)
  let paras = Array.from(element.querySelectorAll('p')).filter(p => !p.querySelector('img'));
  // Compose the content fragment
  let textFrag = document.createDocumentFragment();
  if (heading) textFrag.appendChild(heading);
  paras.forEach(p => {
    // Avoid empty <p> (e.g. <p></p>)
    if (p.textContent.trim()) textFrag.appendChild(p);
  });
  // Only add field comment if there is content
  if (textFrag.childNodes.length > 0) {
    textCell = fieldFragment('text', textFrag);
  }

  // Compose the table
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
