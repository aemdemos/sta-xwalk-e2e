/* global WebImporter */
export default function parse(element, { document }) {
  // Get the actual block element if wrapped
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards') || !cardsBlock.classList.contains('block')) {
    cardsBlock = element.querySelector('.cards.block');
    if (!cardsBlock) return; // Can't find cards block
  }
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  const rows = [['Cards']]; // Header row exactly as required

  lis.forEach((li) => {
    // Image cell
    let imageCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Text cell
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Remove any empty <p> tags to clean up output
      bodyDiv.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim()) p.remove();
      });
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
