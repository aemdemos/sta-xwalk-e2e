/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual block element containing the cards (may be a wrapper)
  let cardsBlock = element;
  // If this is just a wrapper, look for the .cards.block inside
  if (!element.matches('.cards.block')) {
    const inner = element.querySelector('.cards.block');
    if (inner) cardsBlock = inner;
  }
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const rows = [];
  rows.push(['Cards (cards4)']);

  ul.querySelectorAll(':scope > li').forEach((li) => {
    // IMAGE CELL
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        // fallback for robustness
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // TEXT CELL
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Use all child nodes (preserve strong, paragraphs, etc)
      // Remove empty text nodes
      const nodes = Array.from(bodyDiv.childNodes).filter(n => (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())));
      if (nodes.length === 1) {
        textCell = nodes[0];
      } else {
        textCell = nodes;
      }
    }
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
