/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the .hero.block element, regardless of the wrapper
  let heroBlock = element;
  if (!heroBlock.classList.contains('hero') || !heroBlock.classList.contains('block')) {
    heroBlock = element.querySelector('.hero.block');
  }
  if (!heroBlock) return;

  // Step 2: Get the content container (first div inside heroBlock)
  // The structure is heroBlock > div > div > content
  let innerContentDiv = heroBlock;
  const div1 = heroBlock.querySelector(':scope > div');
  if (div1) {
    const div2 = div1.querySelector(':scope > div');
    innerContentDiv = div2 || div1;
  }

  // Step 3: Extract image (picture or img in a p)
  let imageEl = null;
  for (const node of innerContentDiv.children) {
    if (node.tagName === 'P') {
      // look for picture or img inside the p
      const pic = node.querySelector('picture');
      if (pic) {
        imageEl = pic;
        break;
      }
      const img = node.querySelector('img');
      if (img) {
        imageEl = img;
        break;
      }
    }
  }

  // Step 4: Extract the heading and all non-image content
  const contentEls = [];
  for (const child of innerContentDiv.children) {
    // skip the <p> with picture/img
    if (
      child.tagName === 'P' &&
      (child.querySelector('picture') || child.querySelector('img'))
    ) {
      continue;
    }
    // skip empty <p>
    if (child.tagName === 'P' && child.textContent.trim() === '') continue;
    contentEls.push(child);
  }

  // Step 5: Build the table structure
  // Row 0: ['Hero']
  // Row 1: [imageEl]
  // Row 2: [contentEls[]] if any
  const rows = [
    ['Hero'],
    [imageEl],
    [contentEls.length === 1 ? contentEls[0] : contentEls]
  ];

  // Step 6: Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
