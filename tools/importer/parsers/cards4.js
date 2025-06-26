/* global WebImporter */
export default function parse(element, { document }) {
  // Find the element that actually holds the cards
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  // Collect all cards (li)
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);
  // Build rows: header, then one row for each card
  const rows = [
    ['Cards'], // header row, matches the block name exactly
    ...lis.map(li => {
      // Get image or icon (mandatory, first cell)
      // Always reference the <picture> or <img> element directly, not a clone
      let imgCell = null;
      const imgDiv = li.querySelector('.cards-card-image');
      if (imgDiv) {
        const picture = imgDiv.querySelector('picture');
        if (picture) {
          imgCell = picture;
        } else {
          const img = imgDiv.querySelector('img');
          if (img) imgCell = img;
        }
      }
      // Get text content (mandatory, second cell)
      // Use the .cards-card-body div directly, preserving its internal formatting
      const bodyDiv = li.querySelector('.cards-card-body');
      let textCell = bodyDiv;
      return [imgCell, textCell];
    })
  ];
  // Create the table and replace the original wrapper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
