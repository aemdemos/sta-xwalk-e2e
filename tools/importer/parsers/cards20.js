/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list container
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: Find the article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the first img inside the image link
    let imageCell = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell: title, description, and CTA link
    const textParts = [];
    // Title (as heading)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        textParts.push(h3);
      }
    }
    // Description
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    if (descSpan) {
      textParts.push(descSpan);
    }
    // CTA: use the title link as CTA if present
    if (titleLink) {
      // Only add CTA if the link has an href and isn't just the title
      // (If you want to always show the link, uncomment below)
      // textParts.push(titleLink);
    }

    rows.push([imageCell, textParts]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
