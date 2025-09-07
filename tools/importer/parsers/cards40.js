/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image-list block
  const imageList = element.querySelector('.image-list.list, ul.cmp-image-list') || element;
  // Get all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: Find the article content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: Find the image element
    let img = null;
    const imgLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Defensive: If no image, skip this card
    if (!img) return;

    // Text cell: Title and description
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    if (titleSpan) {
      // Create heading element for title
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.push(heading);
    }
    if (descriptionSpan) {
      // Create paragraph for description
      const desc = document.createElement('p');
      desc.textContent = descriptionSpan.textContent;
      textCell.push(desc);
    }
    // Optionally, add CTA if needed (not present in this HTML)

    // Add row: [image, text]
    rows.push([img, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
