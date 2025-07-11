/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block containing the cards
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const rows = [];
  // First row: header
  rows.push(['Cards']);

  // Each card is a <li>
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Image cell
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Use first <picture> or <img> in this div
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          imageCell = imageDiv; // fallback
        }
      }
    }

    // Text cell
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
