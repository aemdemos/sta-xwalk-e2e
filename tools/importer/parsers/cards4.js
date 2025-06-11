/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  const rows = [];
  // Header row exactly as in example
  rows.push(['Cards (cards4)']);

  lis.forEach((li) => {
    // First cell: image or icon
    let imgCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Prefer <picture>, fallback to <img>
      const pic = imgDiv.querySelector('picture');
      if (pic) {
        imgCell = pic;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Second cell: text content
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
