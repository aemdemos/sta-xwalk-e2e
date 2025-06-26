/* global WebImporter */
export default function parse(element, { document }) {
  // Find cards block (the <ul> of cards)
  const cardsBlock = element.querySelector('.cards.block, .cards');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');
  
  // Build table header
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // Each row: [image, text-content]
  cards.forEach(card => {
    // Get image element
    let imageEl = null;
    const imgDiv = card.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Get text content as an array of elements (preserve markup)
    let textEls = [];
    const textDiv = card.querySelector('.cards-card-body');
    if (textDiv) {
      // Get all children (typically <p> elements, but keep all for resilience)
      textEls = Array.from(textDiv.childNodes);
    }

    // Add row: [imageEl, textEls]
    rows.push([imageEl, textEls]);
  });

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
