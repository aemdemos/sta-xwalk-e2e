/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (can be wrapper or the block itself)
  let cardsBlock = element.querySelector('div.cards.block');
  if (!cardsBlock) {
    // Might be called directly on the .cards.block
    cardsBlock = element;
  }
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);
  const rows = [];
  // Header must match exactly the example
  rows.push(['Cards (cards4)']);
  // Each card is a row, with [image, text]
  for (const li of lis) {
    // Image cell
    let imageCell = '';
    const imageDiv = li.querySelector(':scope > .cards-card-image');
    if (imageDiv) {
      // Use the existing <picture> or <img> element, reference directly
      const pictureOrImg = imageDiv.querySelector('picture, img');
      if (pictureOrImg) imageCell = pictureOrImg;
    }
    // Text cell
    let textCell = '';
    const textDiv = li.querySelector(':scope > .cards-card-body');
    if (textDiv) {
      textCell = textDiv;
    }
    rows.push([imageCell, textCell]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
