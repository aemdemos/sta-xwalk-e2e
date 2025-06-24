/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block > ul (the list of cards)
  const cardsBlock = element.querySelector('.cards.block ul');
  if (!cardsBlock) return;
  const cards = Array.from(cardsBlock.children).filter(li => li.tagName === 'LI');

  // Header row as required: only ["Cards"]
  const rows = [['Cards']];

  // For each card (<li>), extract image and text content
  cards.forEach((li) => {
    // Image cell: .cards-card-image (should contain a <picture> or <img>)
    let imageCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Text cell: .cards-card-body (contains all the text for the card)
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the input element with the generated block table
  element.replaceWith(block);
}
