/* global WebImporter */
export default function parse(element, { document }) {
  // Find cards block and the <ul> containing <li> cards
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Header exactly as specified
  const rows = [['Cards (cards4)']];

  lis.forEach((li) => {
    // First cell: image or icon
    let imageCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Select the <picture> or <img> element (prefer <picture> if present)
      imageCell = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
    }

    // Second cell: text content (retain all structure)
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Retain all children (e.g., <p>, <strong>, etc.) preserving order and formatting
      const nodes = Array.from(bodyDiv.childNodes).filter(n => {
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
      textCell = nodes.length === 1 ? nodes[0] : nodes;
    }
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
