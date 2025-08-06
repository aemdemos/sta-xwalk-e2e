/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (the <ul> list of cards)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element; // fallback if block wrapper missing

  // The list of cards is inside a <ul>
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const rows = [];
  // Header row: block name only
  rows.push(['Cards']);

  // For each <li> (card)
  ul.querySelectorAll('li').forEach((li) => {
    // Card image (first cell)
    const imgDiv = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imgDiv) {
      // Reference the <picture> if it exists, otherwise the <img>
      const pic = imgDiv.querySelector('picture');
      if (pic) {
        imageEl = pic;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Card body (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textEls = [];
    if (bodyDiv) {
      // Only include element children (usually <p>), skip whitespace/text nodes
      textEls = Array.from(bodyDiv.children);
    }
    let textCell = '';
    if (textEls.length === 1) {
      textCell = textEls[0];
    } else if (textEls.length > 1) {
      textCell = textEls;
    }
    rows.push([imageEl, textCell]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
