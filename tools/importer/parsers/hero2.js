/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero image (picture or img)
  let imageCell = '';
  const picture = element.querySelector('picture');
  if (picture) {
    // Reference the <picture>'s parent <p> if present, else the <picture> itself
    const parentP = picture.closest('p');
    imageCell = parentP || picture;
  } else {
    const img = element.querySelector('img');
    if (img) {
      const parentP = img.closest('p');
      imageCell = parentP || img;
    }
  }

  // 2. Find the main heading (h1-h6)
  let headingCell = '';
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) headingCell = heading;

  // 3. Compose the content cell for row 3
  // The example only has a heading, no subheading or CTA
  // But we must preserve all heading and paragraph content after the image
  // Gather all content after the image (or its parent <p>), skipping empty <p>
  let contentCell = '';
  if (imageCell) {
    // Find the node after the image cell
    let after = imageCell.nextElementSibling;
    const contentNodes = [];
    while (after) {
      // Stop if we hit another block or section
      if (after.classList && (after.classList.contains('block') || after.classList.contains('section'))) break;
      // Only add non-empty headings and paragraphs
      if (/^h[1-6]$/.test(after.tagName.toLowerCase())) {
        contentNodes.push(after);
      } else if (after.tagName.toLowerCase() === 'p' && after.textContent.trim()) {
        contentNodes.push(after);
      }
      after = after.nextElementSibling;
    }
    // If nothing found, fallback to heading
    if (contentNodes.length) {
      contentCell = contentNodes;
    } else if (headingCell) {
      contentCell = headingCell;
    }
  } else if (headingCell) {
    contentCell = headingCell;
  }

  // 4. Build the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageCell || ''];
  const contentRow = [contentCell || ''];
  const rows = [headerRow, imageRow, contentRow];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
