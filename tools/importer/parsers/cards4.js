/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block containing the cards
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find the underlying <ul> list and all <li> cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cardElements = Array.from(ul.children);

  // Create table header
  const cells = [['Cards']];

  // For each card, create a row: [image, text]
  cardElements.forEach(card => {
    // Image cell
    let imageCell = null;
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else if (imageDiv.firstElementChild) {
        imageCell = imageDiv.firstElementChild;
      } else {
        imageCell = imageDiv;
      }
    }
    // Text cell
    let textCell = null;
    const textDiv = card.querySelector('.cards-card-body');
    if (textDiv) {
      textCell = textDiv;
    }
    cells.push([imageCell, textCell]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
