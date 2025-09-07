/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (the first large image at the top)
  let heroImage = null;
  // Try to find the first .image block inside the main container
  const mainImageDiv = element.querySelector('.image .cmp-image img');
  if (mainImageDiv) {
    heroImage = mainImageDiv;
  } else {
    // Defensive fallback: try any img in the first .image
    const firstImage = element.querySelector('.image img');
    if (firstImage) heroImage = firstImage;
  }

  // Find the main title and subheading (author)
  let titleEl = null, subheadingEl = null;
  // Use less specific selectors to ensure we capture text even if structure changes
  titleEl = element.querySelector('h1');
  subheadingEl = element.querySelector('h4');

  // Compose the text block: title, subheading, and CTA (none in this example)
  const textContent = [];
  if (titleEl) textContent.push(titleEl);
  if (subheadingEl) textContent.push(subheadingEl);

  // Also include any paragraph directly below the title for more text content
  if (titleEl) {
    let next = titleEl.parentElement.nextElementSibling;
    // If next sibling is a div with a paragraph, or a paragraph itself
    if (next) {
      const para = next.querySelector('p') || (next.tagName === 'P' ? next : null);
      if (para) textContent.push(para);
    }
  }

  // Table header
  const headerRow = ['Hero (hero29)'];
  // Table rows
  const imageRow = [heroImage ? heroImage : ''];
  const textRow = [textContent.length ? textContent : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
