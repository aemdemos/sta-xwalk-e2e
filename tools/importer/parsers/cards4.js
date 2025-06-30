/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block (may be inside a wrapper)
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Prepare the block table
  const rows = [['Cards']];
  lis.forEach(li => {
    // Image/Icon cell
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const pic = imageDiv.querySelector('picture');
      if (pic) imageCell = pic;
      else if (imageDiv.firstElementChild) imageCell = imageDiv.firstElementChild;
    }

    // Text cell (preserve formatting)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
