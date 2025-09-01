/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero2)
  const headerRow = ['Hero (hero2)'];

  // Find the hero block (robust to minor HTML variations)
  const heroBlock = element.querySelector('.hero.block');

  let imageCell = '';
  let contentCell = [];

  if (heroBlock) {
    // Drill down to the innermost div containing the actual content
    let innerDiv = heroBlock;
    // Keep drilling down as long as there is exactly one div child
    while (
      innerDiv &&
      innerDiv.querySelector(':scope > div') &&
      innerDiv.children.length === 1 &&
      innerDiv.querySelector(':scope > div') !== innerDiv
    ) {
      innerDiv = innerDiv.querySelector(':scope > div');
    }

    // IMAGE cell: find the first picture or image
    let pictureOrImg = null;
    const firstPicture = innerDiv.querySelector('picture');
    if (firstPicture) {
      pictureOrImg = firstPicture;
    } else {
      const firstImg = innerDiv.querySelector('img');
      if (firstImg) pictureOrImg = firstImg;
    }
    if (pictureOrImg) imageCell = pictureOrImg;

    // CONTENT cell: headings, text, CTAs (excluding image)
    // Only include children that are not <picture> or <img> or <p> containing picture/img
    const contentParts = [];
    Array.from(innerDiv.children).forEach((child) => {
      // Ignore <p> containing <picture> or <img>
      if (
        (child.tagName === 'P' && (child.querySelector('picture') || child.querySelector('img')))
      ) return;
      // Ignore standalone <picture> or <img>
      if (child.tagName === 'PICTURE' || child.tagName === 'IMG') return;
      // Ignore empty paragraphs
      if (child.tagName === 'P' && child.textContent.trim() === '') return;
      contentParts.push(child);
    });
    // If nothing found, fallback to heroBlock h1
    if (contentParts.length === 0) {
      const fallbackHeading = heroBlock.querySelector('h1,h2,h3,h4,h5,h6');
      if (fallbackHeading) contentParts.push(fallbackHeading);
    }
    contentCell = contentParts;
  }

  // Compose the table cells
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}