/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card is a <li> in the image list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: Find image
    const imgDiv = li.querySelector('.cmp-image-list__item-image img');
    let imageEl = null;
    if (imgDiv) {
      imageEl = imgDiv;
    }

    // Defensive: Find title link and text
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      // Use the link with the span inside
      titleEl = titleLink;
    }

    // Defensive: Find description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = descSpan;
    }

    // Compose text cell: title (as link), then description
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Add row: [image, text]
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image list block
  imageList.closest('.image-list.list').replaceWith(block);
}
