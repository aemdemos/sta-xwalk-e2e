/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list container
  const imageList = element.querySelector('.image-list.list .cmp-image-list');
  if (!imageList) return;

  // Header row as per requirements
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // For each card/item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the first <img> inside the image link
    let img = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      img = imageLink.querySelector('img');
    }

    // Text cell: build a fragment with title (as heading) and description
    const frag = document.createElement('div');
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      frag.appendChild(h3);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // CTA: If the title is a link, add it at the end as CTA (if not already used as heading)
    // (In this design, the title is already a heading, so skip extra CTA)

    // Add the row if image and text exist
    if (img && frag.childNodes.length) {
      rows.push([img, frag]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
