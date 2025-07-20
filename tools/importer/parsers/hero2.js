/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero'];

  // Find the image (picture tag)
  let imageEl = null;
  let textEls = [];

  // Find the .hero-wrapper
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    // Find the .hero.block
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      // The actual content is inside heroBlock > div > div
      // heroBlock usually has a single child div, which itself has a single child div
      let contentDiv = null;
      const outerDiv = heroBlock.querySelector(':scope > div');
      if (outerDiv) {
        contentDiv = outerDiv.querySelector(':scope > div');
      }
      if (contentDiv) {
        // Find the <picture> (which is inside a <p>), and also collect text elements
        const children = Array.from(contentDiv.children);
        let foundPicture = false;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (!foundPicture && child.tagName === 'P' && child.querySelector('picture')) {
            imageEl = child.querySelector('picture');
            foundPicture = true;
            continue;
          }
          if (foundPicture) {
            textEls.push(child);
          }
        }
        // If there is no picture, take all as text
        if (!foundPicture) {
          textEls = children;
        }
      }
    }
  }

  // If no imageEl found, set to blank/null
  // If no textEls, set to empty array

  const cells = [
    headerRow,
    [imageEl],
    [textEls]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
