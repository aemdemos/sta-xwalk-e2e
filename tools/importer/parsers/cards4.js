/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the direct .cards.block element (should be present)
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all top-level card <li>s
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Prepare table: header, then one row per card
  const rows = [['Cards']];

  cardItems.forEach((li) => {
    // Get the image/icon cell (mandatory)
    let imageCell = '';
    const imageWrap = li.querySelector('.cards-card-image');
    if (imageWrap) {
      // Reference the actual picture/img element inside
      const pic = imageWrap.querySelector('picture, img, svg');
      if (pic) imageCell = pic;
    }

    // Get the text content cell (mandatory)
    let textCell = '';
    const body = li.querySelector('.cards-card-body');
    if (body) textCell = body;

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
