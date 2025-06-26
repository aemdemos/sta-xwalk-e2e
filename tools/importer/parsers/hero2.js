/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the block root
  const heroBlock = element.querySelector('.hero.block');
  let contentWrapper = null;
  if (heroBlock) {
    // Typically: .hero.block > div > div
    const inner = heroBlock.querySelectorAll(':scope > div > div');
    if (inner.length > 0) {
      contentWrapper = inner[0];
    }
  }
  if (!contentWrapper) contentWrapper = element;

  // Find the image node (picture preferred)
  let imageNode = null;
  let foundImgP = null;

  const children = Array.from(contentWrapper.children);
  for (const child of children) {
    // Find the <p> that directly contains a <picture> or <img>
    if (
      child.nodeName === 'P' &&
      (child.querySelector('picture') || child.querySelector('img'))
    ) {
      foundImgP = child;
      const pic = child.querySelector('picture');
      if (pic) {
        imageNode = pic;
      } else {
        const img = child.querySelector('img');
        if (img) imageNode = img;
      }
      break;
    }
  }

  // Gather all non-image content after the image's <p>
  let heroContent = [];
  if (foundImgP) {
    let found = false;
    for (const child of children) {
      if (child === foundImgP) {
        found = true;
        continue;
      }
      if (found) {
        // Only include nodes that have content
        if (
          child.textContent.trim() !== '' ||
          child.querySelector('a, img, picture, iframe')
        ) {
          heroContent.push(child);
        }
      }
    }
  }
  // Edge case: if nothing after image, but there are headings before, include them
  if (heroContent.length === 0) {
    // Sometimes heading is before or after image
    heroContent = children.filter(
      (c) => ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'].includes(c.nodeName) && c !== foundImgP && c.textContent.trim() !== ''
    );
  }
  // If still empty, just make it blank
  if (heroContent.length === 0) heroContent = [''];

  // Build the table rows exactly as in the example: 1 col x 3 rows. Header is 'Hero'.
  const rows = [
    ['Hero'],
    [imageNode || ''],
    [heroContent.length === 1 ? heroContent[0] : heroContent],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
