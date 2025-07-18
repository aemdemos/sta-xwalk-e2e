/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct cards block (the one with class 'cards block')
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all immediate card items
  const cardsList = cardsBlock.querySelector('ul');
  if (!cardsList) return;
  const cardItems = Array.from(cardsList.children);

  // Prepare the header row as per the spec
  const rows = [['Cards']];

  // For each card, extract image and text body
  for (const card of cardItems) {
    let imageCell = '';
    let textCell = '';

    // Image: select the .cards-card-image content
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      // Prefer <picture> if available for robustness
      const pic = imageDiv.querySelector('picture');
      if (pic) {
        imageCell = pic;
      } else {
        const img = imageDiv.querySelector('img');
        imageCell = img || imageDiv;
      }
    }

    // Text: select the .cards-card-body content
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  }

  // Create the block table using the helper
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(blockTable);
}
