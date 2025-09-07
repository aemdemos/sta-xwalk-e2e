/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the image-list block
  if (!element.classList.contains('image-list')) return;

  // Header row for the Cards block (must match block name exactly)
  const headerRow = ['Cards (cards4)'];

  // Find the image-list <ul>
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Each <li> is a card
  const rows = Array.from(ul.children).filter(li => li.matches('li.cmp-image-list__item')).map((li) => {
    // Image cell
    let imageEl = null;
    const image = li.querySelector('.cmp-image-list__item-image img');
    if (image) imageEl = image.cloneNode(true);

    // Text cell: Title (as heading), Description, CTA (if any)
    const textContent = [];
    // Title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      textContent.push(h3);
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textContent.push(p);
    }
    // CTA: If the title is a link, use it as CTA at the bottom
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read More';
      textContent.push(cta);
    }

    return [imageEl, textContent.length ? textContent : ''];
  });

  // Only replace if there are rows
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows,
    ], document);
    element.replaceWith(table);
  }
}
