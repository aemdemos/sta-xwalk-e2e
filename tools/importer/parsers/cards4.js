/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card <li> elements
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  if (!cardItems.length) return;

  // Table header row as per block guidelines
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // --- Image/Icon cell ---
    let imageCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Reference the existing <picture> (preferred) or <img>
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // --- Text content cell ---
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Collect all child nodes (preserve semantic structure)
      const children = Array.from(bodyDiv.childNodes).filter((node) => {
        // Keep elements and non-empty text nodes
        return (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) ||
               (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      });
      if (children.length === 1) {
        textCell = children[0];
      } else if (children.length > 1) {
        // Wrap in a <div> to preserve block structure
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child.cloneNode(true)));
        textCell = wrapper;
      }
    }

    // Always provide both cells
    rows.push([imageCell || '', textCell || '']);
  });

  // Create and replace with the cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
