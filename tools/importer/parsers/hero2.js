/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the header row
  const headerRow = ['Hero'];

  // 2. Find the main content block: .hero-wrapper .hero.block > div > div
  let contentDiv = null;
  const wrappers = element.querySelectorAll(':scope > .hero-wrapper > .hero.block > div > div');
  if (wrappers.length > 0) {
    contentDiv = wrappers[0];
  } else {
    // Fallback: look for .hero.block > div > div anywhere
    const heroBlock = element.querySelector('.hero.block');
    if (heroBlock) {
      const divs = heroBlock.querySelectorAll('div > div');
      if (divs.length) {
        contentDiv = divs[0];
      }
    }
  }

  // 3. Extract the picture (image) row
  let imageEl = '';
  if (contentDiv) {
    // Find first <picture> or <img> (for background image)
    const pic = contentDiv.querySelector('picture');
    if (pic) {
      imageEl = pic;
    } else {
      // fallback: find img
      const img = contentDiv.querySelector('img');
      if (img) imageEl = img;
    }
  }
  const imageRow = [imageEl];

  // 4. Extract heading and subheading / CTA row
  // All content (h1, h2, p, etc) AFTER the picture (if any)
  let textElements = [];
  if (contentDiv) {
    // Find the index of the paragraph containing the <picture>
    let foundPicture = false;
    for (const child of contentDiv.children) {
      if (!foundPicture && child.querySelector && child.querySelector('picture')) {
        foundPicture = true;
        continue;
      }
      if (foundPicture) {
        // Only include non-empty headings and paragraphs
        if ((/^H[1-6]$/i.test(child.tagName) || child.tagName === 'P') && child.textContent.trim() !== '') {
          textElements.push(child);
        }
      }
    }
  }
  const textRow = [textElements.length > 0 ? textElements : ''];

  // 5. Compose the table
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // 6. Replace the element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
