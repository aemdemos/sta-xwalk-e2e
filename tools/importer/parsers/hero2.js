/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  const heroBlock = element.querySelector('.hero.block');
  let contentDiv = heroBlock;
  // Descend to the deepest content div
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }
  const children = Array.from(contentDiv.children);

  // Find image (picture inside a <p>)
  let imageCell = '';
  for (const child of children) {
    if (child.querySelector && child.querySelector('picture')) {
      imageCell = child;
      break;
    }
  }

  // VERY SPECIFIC FIX: if the image is found in a <p> and the next sibling is the <h1>, include that h1 in the third row
  let headingCell = '';
  if (imageCell && imageCell.nextElementSibling && imageCell.nextElementSibling.tagName === 'H1') {
    headingCell = imageCell.nextElementSibling;
  } else {
    // fallback: find the first <h1> among children
    for (const child of children) {
      if (child.tagName === 'H1') {
        headingCell = child;
        break;
      }
    }
  }

  const rows = [];
  rows.push(['Hero']);
  rows.push([imageCell]);
  rows.push([headingCell]);
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
