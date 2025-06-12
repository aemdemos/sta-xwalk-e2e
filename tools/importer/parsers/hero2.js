/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block main wrapper
  const heroBlock = element.querySelector('.hero.block');
  let imageEl = null;
  let contentEls = [];

  if (heroBlock) {
    // Find the inner container div for content
    let containerDiv = heroBlock;
    // Sometimes extra divs, detect the innermost with content
    const possibleInner = heroBlock.querySelector(':scope > div > div');
    if (possibleInner) containerDiv = possibleInner;
    // Look for picture/image
    const picture = containerDiv.querySelector('picture');
    if (picture) {
      imageEl = picture;
    }
    // Find all children after the image for the content row
    // This supports common variations (empty <p>, various headings, etc)
    let foundPicture = false;
    for (const child of Array.from(containerDiv.children)) {
      if (child.tagName === 'PICTURE') {
        foundPicture = true;
        continue;
      }
      if (foundPicture) {
        // Only add non-empty paragraphs/headings/etc.
        if (child.textContent.trim() !== '' || /^H[1-6]$/.test(child.tagName)) {
          contentEls.push(child);
        }
      }
    }
  }

  // Build table as per the structure: [header], [image], [content]
  // Header must match example exactly
  const tableCells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [contentEls.length > 0 ? contentEls : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // No Section Metadata in example markdown, so no <hr> or metadata!
  element.replaceWith(table);
}
