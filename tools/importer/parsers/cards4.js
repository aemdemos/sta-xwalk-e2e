/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the content wrapper
    const content = li.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // Image cell
    let imageCell = null;
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the image inside the link
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image .cmp-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    // Defensive fallback: if no image found, skip this card
    if (!imageCell) return;

    // Text cell: Title, Description, CTA
    const textCellContent = [];
    // Title (as heading)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element
        const h = document.createElement('h3');
        h.textContent = titleSpan.textContent;
        textCellContent.push(h);
      }
    }
    // Description
    const descSpan = content.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a paragraph for description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCellContent.push(p);
    }
    // CTA (use title link as CTA if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if link is not just for image
      // If the title link is different from the image link, add CTA
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = titleLink.textContent.trim();
      textCellContent.push(cta);
    }
    // Add row to table
    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list element with the block
  element.querySelector('.image-list.list').replaceWith(block);
}
