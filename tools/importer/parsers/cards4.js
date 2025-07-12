/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = ul.querySelectorAll('li');

  // Header row as specified: block name only
  const rows = [['Cards']];

  // Each card: [image/icon, textContent]
  cards.forEach((li) => {
    // First cell: image or icon
    let image = null;
    const imgWrapper = li.querySelector('.cards-card-image');
    if (imgWrapper) {
      // Use the first <picture> or <img>
      const picture = imgWrapper.querySelector('picture');
      if (picture) {
        image = picture;
      } else {
        const img = imgWrapper.querySelector('img');
        if (img) image = img;
      }
    }
    // Second cell: text content
    let textCell = null;
    const body = li.querySelector('.cards-card-body');
    if (body) {
      // Use all child nodes (to preserve formatting and possible future CTA/links)
      // Only include element and non-empty text nodes.
      const kids = Array.from(body.childNodes).filter(n =>
        n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
      textCell = kids.length === 1 ? kids[0] : kids;
    } else {
      textCell = '';
    }
    rows.push([image, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
