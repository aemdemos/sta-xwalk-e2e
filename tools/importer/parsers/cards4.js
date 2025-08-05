/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  // All <li> are cards
  const cards = Array.from(cardsBlock.querySelectorAll('ul > li'));
  const rows = [['Cards']];
  cards.forEach((li) => {
    // Find image (picture or img)
    const imgWrap = li.querySelector('.cards-card-image');
    let imgElem = null;
    if (imgWrap) {
      // always reference the <picture> if present; otherwise img
      imgElem = imgWrap.querySelector('picture') || imgWrap.querySelector('img');
    }
    // Find body content
    const bodyWrap = li.querySelector('.cards-card-body');
    let bodyContent = [];
    if (bodyWrap) {
      // Use all child nodes (elements and text) so strong, paragraphs, etc, are kept in order
      bodyContent = Array.from(bodyWrap.childNodes).filter(n => {
        if (n.nodeType === 1) return true; // element
        if (n.nodeType === 3 && n.textContent.trim().length > 0) return true; // non-empty text
        return false;
      });
    }
    // Compose row: image/icon in first cell, body in second
    rows.push([
      imgElem,
      bodyContent.length === 1 ? bodyContent[0] : bodyContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
