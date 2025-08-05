/* global WebImporter */
export default function parse(element, { document }) {
  // The hero block is nested: .section.hero-container > .hero-wrapper > .hero.block > div > div
  // The image and text are inside this inner div
  let contentDiv = element.querySelector('.hero-wrapper .hero.block > div > div');
  // Fallback if structure is missing
  if (!contentDiv) {
    // Try to find the innermost div containing hero content
    let heroDiv = element.querySelector('.hero-wrapper .hero.block');
    if (heroDiv) {
      const innerDivs = heroDiv.querySelectorAll(':scope > div > div');
      if (innerDivs.length > 0) {
        contentDiv = innerDivs[0];
      } else {
        contentDiv = heroDiv.querySelector(':scope > div');
      }
    } else {
      contentDiv = element;
    }
  }

  // Find the picture (or img if no picture)
  let picture = contentDiv.querySelector('picture');
  if (!picture) {
    picture = contentDiv.querySelector('img');
  }

  // Remove the picture from contentDiv so it doesn't appear twice
  if (picture && picture.parentElement) {
    picture.parentElement.removeChild(picture);
  }

  // Gather the rest of the content (headings, text, etc)
  // Exclude empty paragraphs
  const remainingNodes = Array.from(contentDiv.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'p' && !node.textContent.trim()) return false;
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return false;
    }
    return true;
  });

  // If all text content is empty (e.g. only empty <p>s), the cell should be empty string
  let textCell = '';
  if (remainingNodes.length === 1) {
    textCell = remainingNodes[0];
  } else if (remainingNodes.length > 1) {
    textCell = remainingNodes;
  }

  // Compose the block table as per block spec: 1 column, 3 rows
  const cells = [
    ['Hero'],
    [picture ? picture : ''],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
