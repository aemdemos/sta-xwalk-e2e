/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block wrapper (.hero.block)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Find the deepest content div within the hero block
  let contentDiv = heroBlock;
  // Try .hero.block > div > div
  if (heroBlock.children.length > 0 && heroBlock.children[0].children.length > 0) {
    contentDiv = heroBlock.children[0].children[0];
  } else if (heroBlock.children.length > 0) {
    contentDiv = heroBlock.children[0];
  }

  // Get all immediate children of the contentDiv
  const directChildren = Array.from(contentDiv.children);

  // Row 2: Find a background image (picture or img)
  let bgImage = null;
  for (const child of directChildren) {
    // Look for <picture> or <img> inside the child
    const pic = child.querySelector('picture');
    if (pic) {
      bgImage = pic;
      break;
    }
    const img = child.querySelector('img');
    if (img && !bgImage) {
      bgImage = img;
    }
  }
  // Row 3: Collect all non-image content (headings, paragraphs, etc.)
  const nonImageContent = [];
  for (const child of directChildren) {
    // If this child contains a <picture>, it's the image, skip for text
    if (child.querySelector('picture')) continue;
    // If it's an empty <p>, skip
    if (child.tagName === 'P' && child.textContent.trim() === '') continue;
    // Otherwise, add it
    nonImageContent.push(child);
  }

  // As per example, header is 'Hero', and three rows (header, bg image, text)
  const tableRows = [
    ['Hero'],
    [bgImage || ''],
    [nonImageContent.length === 1 ? nonImageContent[0] : nonImageContent]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
