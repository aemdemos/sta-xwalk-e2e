/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> with all card <li>s
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);
  const rows = [];
  // Header row:
  rows.push(['Cards (cards4)']);
  // Each card: two cells, [image, text]
  cards.forEach((li) => {
    // First cell: image or icon
    let imgCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Prefer the picture element (for possible responsive images)
      const picture = imgDiv.querySelector('picture');
      imgCell = picture || imgDiv;
    }
    // Second cell: text (title, description, cta)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;
    rows.push([imgCell, textCell]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
