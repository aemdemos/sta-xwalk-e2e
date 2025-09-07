/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container with all the cards content
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect all cards as [image, text] rows
  const rows = [ ['Cards (cards16)'] ];

  // Helper: get all direct children of elementsContainer
  const children = Array.from(elementsContainer.childNodes);

  // State for card parsing
  let currentImage = null;
  let currentTitle = null;
  let currentDesc = [];
  let inCard = false;

  // Helper: flush card row if ready
  function flushCard() {
    if (currentImage && (currentTitle || currentDesc.length)) {
      const textCell = [];
      if (currentTitle) textCell.push(currentTitle);
      if (currentDesc.length) textCell.push(...currentDesc);
      rows.push([currentImage, textCell]);
    }
    currentImage = null;
    currentTitle = null;
    currentDesc = [];
    inCard = false;
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Card image is always inside a .image div, possibly nested
    if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) {
      const imageDiv = node.querySelector('.image .cmp-image');
      if (imageDiv) {
        // If we already have a card in progress, flush it
        flushCard();
        currentImage = imageDiv;
        inCard = true;
      }
      continue;
    }
    // Card title is always an <h2>
    if (node.nodeType === 1 && node.tagName === 'H2') {
      currentTitle = node;
      inCard = true;
      continue;
    }
    // Card description is always a <p>
    if (node.nodeType === 1 && node.tagName === 'P') {
      currentDesc.push(node);
      inCard = true;
      continue;
    }
    // If we hit a non-card element and we were in a card, flush
    if (inCard && (node.nodeType === 1 || node.nodeType === 3)) {
      flushCard();
    }
  }
  // Flush last card
  flushCard();

  // Only output if we found at least one card row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(block);
  }
}
