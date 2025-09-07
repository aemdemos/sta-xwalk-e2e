/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Each card's content is inside article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the <img> inside the image link
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!imgEl) return;

    // Text cell: Title (as heading), Description, and CTA (title link)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const descSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    // Title as heading (h3)
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.push(h3);
    }
    // Description
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCell.push(p);
    }
    // CTA link (if present and not duplicate of title)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already included in heading
      // (in this structure, the title is the link text, so skip duplicate CTA)
      // If you want to add a CTA, uncomment below:
      // const cta = document.createElement('a');
      // cta.href = titleLink.href;
      // cta.textContent = titleSpan ? titleSpan.textContent : titleLink.textContent;
      // textCell.push(cta);
    }

    // Add row: [image, text cell]
    rows.push([imgEl, textCell]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
