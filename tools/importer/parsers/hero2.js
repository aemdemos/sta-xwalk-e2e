/* global WebImporter */
export default function parse(element, { document }) {
  // Traverse to the deepest content block
  let mainContent = element;
  while (mainContent && mainContent.children.length === 1 && mainContent.firstElementChild) {
    mainContent = mainContent.firstElementChild;
  }

  // Attempt to find the <picture> (wrapped in <p>)
  let imagePara = null;
  const picture = mainContent.querySelector('picture');
  if (picture && picture.closest('p') && picture.closest('p').parentElement === mainContent) {
    imagePara = picture.closest('p');
  }

  // Collect content nodes for the text & headings (all children except the image <p> and empty <p>)
  const contentNodes = [];
  Array.from(mainContent.children).forEach((child) => {
    if (imagePara && child === imagePara) return; // skip image <p>
    if (child.tagName === 'P' && child.textContent.trim() === '' && child.children.length === 0) return; // skip empty <p>
    contentNodes.push(child);
  });

  // Build table rows
  const headerRow = ['Hero'];
  const imageRow = [imagePara ? imagePara : ''];
  const contentRow = [contentNodes.length ? contentNodes : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the element in-place
  element.replaceWith(table);
}
