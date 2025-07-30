/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the innermost .cards.block for flexibility
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const cardsList = cardsBlock.querySelector('ul');
  if (!cardsList) return;
  const cards = cardsList.querySelectorAll(':scope > li');
  const rows = [['Cards']];
  cards.forEach((card) => {
    // Defensive: image cell
    const imgDiv = card.querySelector('.cards-card-image');
    // Defensive: text cell
    const bodyDiv = card.querySelector('.cards-card-body');
    // If either is missing, skip this card
    if (!imgDiv || !bodyDiv) return;
    rows.push([imgDiv, bodyDiv]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
