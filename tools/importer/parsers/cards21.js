/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row for this block
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the image-list block (defensive: could be direct child or nested)
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // For each card (li), extract the image and text content
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article containing the card content
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the image link
    let imageCell = '';
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // The image is inside a nested div inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Title (as heading)
    let titleElem = article.querySelector('.cmp-image-list__item-title');
    let heading = null;
    if (titleElem) {
      heading = document.createElement('strong');
      heading.textContent = titleElem.textContent;
    }
    // Description
    let descElem = article.querySelector('.cmp-image-list__item-description');
    // Compose text cell content
    const textCellContent = [];
    if (heading) textCellContent.push(heading);
    if (descElem) textCellContent.push(document.createElement('br'), descElem);

    // Add row: [image, text]
    rows.push([
      imageCell,
      textCellContent.filter(Boolean)
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
