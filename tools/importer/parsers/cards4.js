/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> that contains the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Header row as in the example
  const rows = [['Cards (cards4)']];

  // For each card, add a row with two cells: image and text
  cards.forEach(li => {
    // First cell: image (picture or img)
    const imgDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      const img = imgDiv.querySelector('img');
      imageCell = picture || img || '';
    }

    // Second cell: text (all content inside .cards-card-body, preserve structure)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Keep the strong, paragraphs, etc - reference the actual nodes
      // (avoid creating new elements or strings)
      // Filter out empty text nodes
      const nodes = Array.from(bodyDiv.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      textCell = nodes.length === 1 ? nodes[0] : nodes;
    }
    rows.push([imageCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
