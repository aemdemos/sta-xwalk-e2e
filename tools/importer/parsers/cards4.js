/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block within the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const cards = Array.from(list.children); // Each li is one card

  // Start table with header row exactly matching the block name
  const rows = [['Cards']];

  cards.forEach((card) => {
    // Image cell: prefer <picture>, fallback to <img>
    let imageCell = null;
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Text cell: all children of .cards-card-body (preserve structure)
    let textCell = null;
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      // If just one child, use it directly, else array for robustness
      const bodyNodes = Array.from(bodyDiv.childNodes).filter(n => !(n.nodeType === 3 && n.textContent.trim() === ''));
      textCell = bodyNodes.length === 1 ? bodyNodes[0] : bodyNodes;
    }
    // Only add rows with at least one meaningful cell to avoid empty rows
    if (imageCell || textCell) {
      rows.push([imageCell, textCell]);
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
