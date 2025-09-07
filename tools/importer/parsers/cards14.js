/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // For each card (LI)
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image (first cell)
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imgEl) {
      // Try to find any img inside the li
      imgEl = li.querySelector('img');
    }

    // Find the text content (second cell)
    const textContent = [];
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Create heading element (h3)
      const h = document.createElement('h3');
      // If the title is wrapped in a span, use its text
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        h.textContent = span.textContent;
      } else {
        h.textContent = titleLink.textContent;
      }
      // If the link has an href, wrap the heading in a link
      if (titleLink.getAttribute('href')) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(h);
        textContent.push(a);
      } else {
        textContent.push(h);
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use a paragraph for description
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.push(p);
    }
    // Optionally, add a CTA if present (not in this HTML, but for generality)
    // If there is a link that is not the title link or image link, add it
    li.querySelectorAll('a').forEach((a) => {
      if (
        !a.classList.contains('cmp-image-list__item-title-link') &&
        !a.classList.contains('cmp-image-list__item-image-link')
      ) {
        textContent.push(a);
      }
    });

    // Compose the row: [image, textContent]
    rows.push([
      imgEl,
      textContent,
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
