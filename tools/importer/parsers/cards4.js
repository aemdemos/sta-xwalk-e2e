/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block within the given element
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Table header as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Defensive: find the article content
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image inside the image link
    let imageCell = '';
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        // Use the image div directly (contains the .cmp-image and img)
        imageCell = imageDiv;
      }
    }

    // Text cell: build a fragment with title, description, and link
    const textCellContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use the span inside the link as heading
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap in <strong> to mimic heading style
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCellContent.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add a <div> for spacing/structure
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textCellContent.push(descDiv);
    }
    // CTA: if the title link exists, use it as a CTA at the bottom
    if (titleLink) {
      // Clone the link and set text to 'Read More'
      const cta = titleLink.cloneNode(true);
      cta.textContent = 'Read More';
      textCellContent.push(cta);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list element with the new table
  imageList.parentNode.replaceWith(table);
}
