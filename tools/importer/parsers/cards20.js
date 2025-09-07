/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Table header row as per block name
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the image list container
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    let imageCell = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('div.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    if (!imageCell) return;

    // --- TEXT CELL ---
    const textContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // Call-to-action (use the title link if present)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Learn more';
      textContent.push(cta);
    }

    rows.push([imageCell, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
