/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (works for .cards or .cards-wrapper)
  // If 'element' is the block wrapper, get the '.cards' child, else use itself
  let cardsBlock = element.classList.contains('cards') ? element : element.querySelector('.cards');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');
  
  // Header row
  const rows = [['Cards']];

  // Each card: [image (picture), text body]
  cards.forEach(li => {
    // Defensive: find the image (div.cards-card-image) and text (div.cards-card-body)
    const imgDiv = li.querySelector('.cards-card-image');
    let imgContent = '';
    if (imgDiv) {
      // Find <picture> or <img> inside imgDiv
      const pic = imgDiv.querySelector('picture');
      if (pic) imgContent = pic;
      else {
        const img = imgDiv.querySelector('img');
        if (img) imgContent = img;
        else imgContent = imgDiv; // fallback to the div itself if present
      }
    }
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = '';
    if (bodyDiv) textContent = bodyDiv;

    rows.push([imgContent, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
