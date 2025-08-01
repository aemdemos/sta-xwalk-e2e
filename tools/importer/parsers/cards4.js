/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block always uses header 'Cards'
  const rows = [['Cards']];

  // Find the <ul> containing the card <li>s
  const cardsBlock = element.querySelector('ul');
  if (!cardsBlock) return;

  // For each <li>, extract image and text content
  Array.from(cardsBlock.children).forEach((li) => {
    // Image or icon
    let imageCell = undefined;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Usually contains <picture> (preferred), or <img>
      const picture = imgDiv.querySelector('picture');
      const img = imgDiv.querySelector('img');
      if (picture) {
        imageCell = picture;
      } else if (img) {
        imageCell = img;
      }
    }
    // Text content
    let textCell = undefined;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Use all children (typically <p> elements with <strong> in one)
      const contentNodes = Array.from(bodyDiv.childNodes).filter(node => {
        // Keep non-empty text nodes or elements
        if (node.nodeType === 3) return node.textContent.trim().length > 0;
        if (node.nodeType === 1) return true;
        return false;
      });
      // If only one, just use that, else pass array for structure
      textCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
