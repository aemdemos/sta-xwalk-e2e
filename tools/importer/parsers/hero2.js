/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the hero block content wrapper
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) {
    element.replaceWith(document.createTextNode(''));
    return;
  }

  // Step 2: The content is in .hero.block > div > div
  let contentContainer = null;
  const outerDiv = heroBlock.querySelector('div');
  if (outerDiv) {
    contentContainer = outerDiv.querySelector('div');
  }
  if (!contentContainer) {
    element.replaceWith(document.createTextNode(''));
    return;
  }

  // Step 3: Find image (picture or img) and text content
  let imageEl = null;
  let textContentEls = [];

  // Go through direct children of contentContainer
  const children = Array.from(contentContainer.children);

  // Find image element (first <picture> or <img>)
  for (let child of children) {
    if (child.tagName === 'P' && child.querySelector('picture')) {
      imageEl = child.querySelector('picture');
      break;
    } else if (child.tagName === 'PICTURE') {
      imageEl = child;
      break;
    } else if (child.tagName === 'IMG') {
      imageEl = child;
      break;
    }
  }

  // Gather all elements except the <p> with <picture> (image)
  textContentEls = children.filter(child => {
    if (child.tagName === 'P' && child.querySelector('picture')) return false;
    if (child.tagName === 'PICTURE') return false;
    if (child.tagName === 'IMG') return false;
    // Otherwise, keep
    return true;
  });

  // If no text content (sometimes p is empty), set to empty string as in example
  let textCellContent;
  if (textContentEls.length === 0) {
    textCellContent = '';
  } else {
    textCellContent = textContentEls;
  }

  // Step 4: Build the table as in the example
  const tableRows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textCellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Step 5: Replace original element with block table
  element.replaceWith(table);
}
