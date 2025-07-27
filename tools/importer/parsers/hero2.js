/* global WebImporter */
export default function parse(element, { document }) {
  // Attempt to find the deepest hero content div
  let heroBlock = element.querySelector('.hero.block');
  let contentDiv = heroBlock || element;
  // Drill down through single-child <div>s to get inner content
  while (
    contentDiv.children.length === 1 &&
    contentDiv.children[0].tagName === 'DIV'
  ) {
    contentDiv = contentDiv.children[0];
  }

  // Find the first <picture> or <img> as the background image
  let bgImage = null;
  let firstPicture = contentDiv.querySelector('picture');
  if (firstPicture) {
    bgImage = firstPicture;
  } else {
    let firstImg = contentDiv.querySelector('img');
    if (firstImg) {
      bgImage = firstImg;
    }
  }

  // Collect all nodes (except the image/picture itself and empty <p>s)
  let richContent = [];
  for (const node of contentDiv.childNodes) {
    // Skip text nodes that are just whitespace
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') continue;
    // Skip <p> that contains just the <picture> or <img>
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName === 'P' &&
      (node.querySelector('picture') || node.querySelector('img'))
    ) {
      continue;
    }
    // Skip <picture> or <img> not wrapped in <p>
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.tagName === 'PICTURE' || node.tagName === 'IMG')
    ) {
      continue;
    }
    // Skip <p> that's empty
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName === 'P' &&
      node.textContent.trim() === ''
    ) {
      continue;
    }
    // Otherwise, include the node as-is
    richContent.push(node);
  }

  // Table per block spec: Header, Image row, RichText row
  const rows = [
    ['Hero'],
    [bgImage ? bgImage : ''],
    [richContent.length ? richContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
