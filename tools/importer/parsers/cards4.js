/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block either by data-block-name or class
  let cardsBlock = element.querySelector('.cards.block[data-block-name="cards"]');
  if (!cardsBlock) cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element;

  // Find the <ul> containing all <li> cards
  const list = cardsBlock.querySelector('ul');
  const cards = list ? Array.from(list.children) : [];

  const rows = [['Cards']]; // Header row, matches example

  cards.forEach((li) => {
    // Image/Icon cell (mandatory)
    let imageCell = null;
    const imgWrap = li.querySelector('.cards-card-image');
    if (imgWrap) {
      // Only reference the <picture> element if present, else <img>
      const pic = imgWrap.querySelector('picture');
      imageCell = pic || imgWrap.querySelector('img') || '';
    } else {
      imageCell = '';
    }

    // Text content cell (mandatory)
    let textCell = null;
    const body = li.querySelector('.cards-card-body');
    if (body) {
      // Reference the existing body element for semantic formatting
      textCell = body;
    } else {
      textCell = '';
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
