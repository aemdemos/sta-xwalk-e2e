/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block > ul representing the cards list
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Build header row
  const rows = [['Cards']];

  // Iterate through each card <li>
  for (const li of cards) {
    // Image cell
    let imageCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Prefer <picture>, otherwise <img>
      const pic = imageDiv.querySelector('picture');
      if (pic) {
        imageCell = pic;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    // Always push a row for each card, even if image or text is missing
    rows.push([imageCell, textCell]);
  }

  // Create the cards block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
