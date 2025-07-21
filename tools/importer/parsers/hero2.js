/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero-wrapper inside the main container
  const heroWrapper = element.querySelector('.hero-wrapper');

  let mainContentDiv = null;
  if (heroWrapper) {
    // .hero.block inside heroWrapper
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      // The actual content div: heroBlock > div > div
      const innerDiv = heroBlock.querySelector('div > div');
      mainContentDiv = innerDiv || heroBlock.querySelector('div') || heroBlock;
    }
  }
  // Fallback: in case structure is different
  if (!mainContentDiv) {
    mainContentDiv = element;
  }

  // Find first <picture> or <img> for image row
  let imageEl = mainContentDiv.querySelector('picture, img');
  // If picture, use the picture element itself
  // If img only, use img

  // Collect heading, subheading, cta etc. (all except image)
  const contentNodes = [];
  for (let child of mainContentDiv.children) {
    // Skip <picture> or <img> (already handled in image row)
    if (child.tagName.toLowerCase() === 'picture' || child.tagName.toLowerCase() === 'img') {
      continue;
    }
    // Skip empty paragraphs
    if (child.tagName.toLowerCase() === 'p' && child.textContent.trim() === '') {
      continue;
    }
    contentNodes.push(child);
  }
  // If no main children, try to find heading in mainContentDiv somewhere
  if (contentNodes.length === 0) {
    // Fallback: select heading inside mainContentDiv
    const heading = mainContentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentNodes.push(heading);
  }

  // Table rows as per the Hero block requirements
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentNodes.length > 1 ? contentNodes : (contentNodes[0] || '')],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
