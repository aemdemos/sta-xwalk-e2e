/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost hero block (if present)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // The content is inside heroBlock's children
  // 1. Extract the image (picture)
  // 2. Extract the content (heading, subheading, cta)

  // Step 1: Find the picture or img
  let imageCell = '';
  let pic = heroBlock.querySelector('picture');
  if (pic) {
    imageCell = pic;
  } else {
    // fallback: img
    let img = heroBlock.querySelector('img');
    if (img) imageCell = img;
  }

  // Step 2: Extract content (all elements except for the image/picture)
  // Assume: first div > div > ... structure as in the provided HTML
  // We'll assemble all content after the picture (but skip empty <p>)
  let contentParent = heroBlock;
  // Try to drill down if necessary
  // .hero.block > div > div
  if (heroBlock.children.length === 1 && heroBlock.children[0].children.length === 1) {
    contentParent = heroBlock.children[0].children[0];
  } else if (heroBlock.children.length === 1) {
    contentParent = heroBlock.children[0];
  }

  // Remove image from the contentParent's children and collect the rest
  const contentNodes = [];
  Array.from(contentParent.childNodes).forEach((child) => {
    // skip picture and its wrapping <p>
    if (child.nodeType === 1 && child.tagName === 'P' && child.querySelector('picture')) return;
    if (child.nodeType === 1 && child.tagName === 'PICTURE') return;
    if (child.nodeType === 1 && child.tagName === 'IMG') return;
    // skip empty paragraphs
    if (child.nodeType === 1 && child.tagName === 'P' && !child.textContent.trim()) return;
    if (child.nodeType === 3 && !child.textContent.trim()) return; // skip whitespace text
    contentNodes.push(child);
  });

  // If contentNodes is empty, fallback to heading
  let contentCell;
  if (contentNodes.length > 0) {
    contentCell = contentNodes;
  } else {
    // fallback: h1/h2/h3 inside heroBlock
    let heading = heroBlock.querySelector('h1, h2, h3');
    if (heading) {
      contentCell = heading;
    } else {
      contentCell = '';
    }
  }

  // Compose the block table
  const cells = [
    ['Hero'],
    [imageCell],
    [contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
