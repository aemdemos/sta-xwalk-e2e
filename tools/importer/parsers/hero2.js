/* global WebImporter */
export default function parse(element, { document }) {
  // Create table header row as per spec
  const headerRow = ['Hero'];

  // Find the main content div within this block
  let heroContent = element;
  // Look for .hero-wrapper > .hero.block > div > div
  const wrapper = element.querySelector(':scope > .hero-wrapper');
  if (wrapper) {
    const heroBlock = wrapper.querySelector(':scope > .hero.block');
    if (heroBlock) {
      const contentDiv = heroBlock.querySelector(':scope > div > div');
      if (contentDiv) heroContent = contentDiv;
    }
  }

  // Find background image (picture inside first p)
  let backgroundRowCell = '';
  const pEls = heroContent.querySelectorAll(':scope > p');
  for (const p of pEls) {
    if (p.querySelector('picture, img')) {
      backgroundRowCell = p;
      break;
    }
  }

  // Collect heading + other content for the third row
  // Only direct children, skipping the backgroundRowCell and empty <p>
  const contentElements = [];
  for (const child of heroContent.children) {
    if (backgroundRowCell && child === backgroundRowCell) continue;
    if (child.tagName === 'P' && !child.textContent.trim()) continue;
    contentElements.push(child);
  }
  // Fallback: if nothing else, search for a heading in heroContent
  if (contentElements.length === 0) {
    const heading = heroContent.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentElements.push(heading);
  }

  // Assemble the table with exact structure
  const rows = [
    headerRow,
    [backgroundRowCell],
    [contentElements.length > 0 ? contentElements : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
