/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Each card's content is inside article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the first img inside the card
    let img = article.querySelector('img');
    // Defensive: if image is wrapped in a link, use the link as parent
    let imageCell;
    if (img) {
      imageCell = img.closest('a') || img;
    } else {
      imageCell = '';
    }

    // Text cell: Title, Description, CTA (if present)
    // Title: use the span.cmp-image-list__item-title, optionally wrapped in link
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    let titleElem = null;
    if (titleLink) {
      // Use the link, but only the span inside
      const span = titleLink.querySelector('span.cmp-image-list__item-title');
      if (span) {
        // Create a heading element (h3) and append the span (preserves styling)
        const h3 = document.createElement('h3');
        h3.appendChild(span);
        // Wrap heading in link if present
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(h3);
        titleElem = link;
      }
    }
    // Defensive fallback: if no link, just use the span
    if (!titleElem) {
      const span = article.querySelector('span.cmp-image-list__item-title');
      if (span) {
        const h3 = document.createElement('h3');
        h3.appendChild(span);
        titleElem = h3;
      }
    }

    // Description
    const desc = article.querySelector('span.cmp-image-list__item-description');
    let descElem = null;
    if (desc) {
      // Use a paragraph for description
      const p = document.createElement('p');
      p.appendChild(desc);
      descElem = p;
    }

    // Compose text cell
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) textCell.push(descElem);
    // No explicit CTA in this HTML, but if present, would add here

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
