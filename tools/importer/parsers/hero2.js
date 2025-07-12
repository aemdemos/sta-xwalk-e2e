/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (if present), else use the element provided
  const heroBlock = element.querySelector('[data-block-name="hero"]') || element;

  // Find the main div containing the hero content
  let contentDiv = null;
  const divs = heroBlock.querySelectorAll(':scope > div > div');
  if (divs.length > 0) {
    contentDiv = divs[0];
  } else {
    // fallback: find first inner div
    const innerDiv = heroBlock.querySelector(':scope > div');
    contentDiv = innerDiv || heroBlock;
  }

  // Extract the image (the picture or img)
  let heroImage = null;
  // Search for picture or img inside contentDiv
  heroImage = contentDiv.querySelector('picture') || contentDiv.querySelector('img');

  // For the text content, skip the <picture> and any empty <p>
  const textElements = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Skip if this is the <picture> with the heroImage
    if (heroImage && (child === heroImage || child.contains(heroImage))) return;
    // Skip empty paragraphs
    if (child.tagName === 'P' && child.textContent.trim() === '') return;
    // Include headings, paragraphs, or any text element
    textElements.push(child);
  });
  
  // Build rows for table
  const headerRow = ['Hero'];
  const imageRow = [heroImage ? heroImage : ''];
  let textRow;
  if (textElements.length === 1) {
    textRow = [textElements[0]];
  } else if (textElements.length > 1) {
    textRow = [textElements];
  } else {
    textRow = [''];
  }

  // Compose table cells
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
