/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing all cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children); // li elements

  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach((li) => {
    // First column: image (picture or the div itself)
    const imgDiv = li.querySelector('.cards-card-image');
    let imgContent = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      imgContent = picture ? picture : imgDiv;
    }
    // Second column: text content (all children of .cards-card-body)
    const bodyDiv = li.querySelector('.cards-card-body');
    let bodyContent = [];
    if (bodyDiv) {
      bodyContent = Array.from(bodyDiv.childNodes).filter(node => {
        // Only include element nodes and non-empty text nodes
        return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      });
    }
    rows.push([
      imgContent,
      bodyContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
