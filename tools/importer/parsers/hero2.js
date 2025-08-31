/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row, exactly as specified
  const headerRow = ['Hero (hero2)'];

  // Find the hero block
  const heroBlock = element.querySelector('.hero.block');

  // These will be populated for the table rows
  let backgroundImgCell = '';
  let textContentCell = '';

  if (heroBlock) {
    // The hero content usually lives in heroBlock > div > div
    const innerContainers = heroBlock.querySelectorAll(':scope > div > div');
    // If no nested div structure, fallback to direct children
    const heroContent = innerContainers.length ? innerContainers[0] : heroBlock;

    // --- Image row ---
    // Look for a <picture> or <img> as the background visual
    let picture = heroContent.querySelector('picture');
    let img = heroContent.querySelector('img');
    if (picture) {
      backgroundImgCell = picture;
    } else if (img) {
      backgroundImgCell = img;
    } else {
      backgroundImgCell = '';
    }

    // --- Text row ---
    // Gather headline, subheading, paragraph, CTA in order
    // Exclude <p> that contains a <picture> or <img>
    const textElements = [];
    heroContent.childNodes.forEach((node) => {
      if (node.nodeType === 1) { // element only
        if (node.tagName === 'P' && node.querySelector('picture, img')) {
          // skip image-containing p
          return;
        }
        if (['H1','H2','H3','P'].includes(node.tagName)) {
          // retain formatting and order
          textElements.push(node);
        }
      }
    });
    // Only add if there are text elements (avoids empty)
    textContentCell = textElements.length ? textElements : '';
  }

  // Compose the table rows: 1 column, 3 rows
  const rows = [
    headerRow,
    [backgroundImgCell],
    [textContentCell]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
