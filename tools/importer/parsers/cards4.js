/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual cards block (may be wrapped)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
    if (!cardsBlock) return;
  }
  // Find all card <li> elements
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Image/Icon cell (mandatory)
    const imgDiv = li.querySelector('.cards-card-image');
    let imgElem = null;
    if (imgDiv) {
      // Use the <picture> or <img> directly
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgElem = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgElem = img;
      }
    }
    // Text content cell (mandatory)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = [];
    if (bodyDiv) {
      // Title: first <p> with <strong> or just first <p>
      const ps = bodyDiv.querySelectorAll('p');
      if (ps.length > 0) {
        // Title
        const firstP = ps[0];
        textContent.push(firstP);
        // Description (if present)
        if (ps.length > 1) {
          textContent.push(ps[1]);
        }
      } else {
        // fallback: use all content
        textContent.push(...bodyDiv.childNodes);
      }
    }
    // Compose row: [image, text content]
    rows.push([
      imgElem,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
