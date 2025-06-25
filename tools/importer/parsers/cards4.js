/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards block (should be <div class="cards block"> inside <div class="cards-wrapper">)
  // The 'element' is the wrapper, so find the immediate block inside
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Header row has 'Cards' only (no variant)
  const rows = [['Cards']];

  // Each card is 2 columns: image/icon | text content
  cards.forEach(card => {
    let imageCell = '';
    // The image div contains a <picture>, which should be referenced
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        // fallback, try <img> directly
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // The body div contains the card's text content
    const bodyDiv = card.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use all child nodes (including text nodes) to preserve formatting (eg. <strong>)
      // Only non-empty nodes
      textCell = Array.from(bodyDiv.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '')
      );
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table block and replace the original cards wrapper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
