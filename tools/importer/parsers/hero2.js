/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const headerRow = ['Hero'];

  // Find the .hero.block within the element
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Find the content container (usually nested divs)
  let contentDiv = heroBlock;
  const divs = heroBlock.querySelectorAll(':scope > div');
  if (divs.length === 1) {
    contentDiv = divs[0];
    const deeperDivs = contentDiv.querySelectorAll(':scope > div');
    if (deeperDivs.length === 1) {
      contentDiv = deeperDivs[0];
    }
  }

  // Find the first picture or img for the image row
  let imageEl = null;
  const pic = contentDiv.querySelector('picture');
  if (pic) {
    imageEl = pic;
  } else {
    // fallback: use img if present
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }
  const imageRow = [imageEl ? imageEl : ''];

  // For the content row: Find all children except the p containing only the picture
  const contentNodes = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Exclude <p> with only the image/picture
    if (
      child.tagName === 'P' &&
      (child.querySelector('picture') || child.querySelector('img')) &&
      child.childNodes.length === 1
    ) {
      return;
    }
    // Exclude empty paragraphs
    if (child.tagName === 'P' && child.textContent.trim() === '') {
      return;
    }
    // Otherwise, include the child (heading, paragraph, etc)
    contentNodes.push(child);
  });
  // If there is at least one node, pass all as array; otherwise empty string
  const textRow = [contentNodes.length ? (contentNodes.length === 1 ? contentNodes[0] : contentNodes) : ''];

  // Assemble table data
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
