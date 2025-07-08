/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner .cards.block (in case the wrapper is passed)
  const cardsBlock = element.classList.contains('cards') ? element : element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const liCards = Array.from(ul.children).filter(el => el.tagName === 'LI');

  const headerRow = ['Cards'];
  const rows = [headerRow];

  liCards.forEach((li) => {
    // Card image: first picture inside .cards-card-image
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const pic = imageDiv.querySelector('picture');
      if (pic) imageCell = pic;
    }
    // Card text: .cards-card-body (which contains title/desc)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
