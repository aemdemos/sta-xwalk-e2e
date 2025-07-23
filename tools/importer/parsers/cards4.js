/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct .cards.block descendant (not just any .cards.block in the DOM)
  const cardsBlock = element.querySelector(':scope > .cards.block');
  if (!cardsBlock) return;
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  // Table header matches example exactly
  const rows = [['Cards']];

  items.forEach((li) => {
    // First cell: image or icon (picture preferred)
    let imageCell = '';
    const imageDiv = li.querySelector(':scope > .cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      imageCell = picture || imageDiv;
    }

    // Second cell: text (title, description, formatting retained)
    let textCell = '';
    const bodyDiv = li.querySelector(':scope > .cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
