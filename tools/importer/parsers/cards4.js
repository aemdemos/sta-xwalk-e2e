/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner block containing the <ul>
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  // Initialize rows: first row is header
  const rows = [['Cards (cards4)']];

  // For each card <li> in the list
  ul.querySelectorAll('li').forEach((li) => {
    // Image cell: get the <picture> or <img> only (NO wrapper div)
    let imgCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) {
          imgCell = img;
        }
      }
    }
    // Text cell: get children of body div (NO wrapper div)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Only use element nodes and non-empty text nodes
      const nodes = [];
      bodyDiv.childNodes.forEach((n) => {
        if (n.nodeType === 1) { // Element nodes only
          nodes.push(n);
        } else if (n.nodeType === 3 && n.textContent.trim().length > 0) { // Text node
          nodes.push(document.createTextNode(n.textContent));
        }
      });
      textCell = nodes;
    }
    rows.push([imgCell, textCell]);
  });

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
