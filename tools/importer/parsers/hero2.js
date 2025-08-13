/* global WebImporter */
export default function parse(element, { document }) {
  // Setup rows array for table
  const rows = [];
  // Header row
  rows.push(['Hero']);

  // Try to find the hero block
  const heroBlock = element.querySelector('.hero.block');

  let imageEl = null;
  let headlineEl = null;
  let descriptionEls = [];

  // Extract content from the hero block if present
  if (heroBlock) {
    // The image is typically the first <picture> (or <img>) inside the block
    imageEl = heroBlock.querySelector('picture') || heroBlock.querySelector('img');

    // Find the content wrapper (usually the inner-most <div>)
    // This will contain the heading and any other content
    // We'll treat all direct children as content
    let contentDiv = null;
    // Try to find a nested div with p/h tags
    const innerDivs = heroBlock.querySelectorAll('div > div');
    if (innerDivs.length) {
      // Use the first inner div
      contentDiv = innerDivs[0];
    } else {
      // Fallback: use direct children of heroBlock
      contentDiv = heroBlock;
    }
    // Now, extract heading and other content
    // Heading: the first h1-h6 inside contentDiv
    headlineEl = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    // Description: all <p> or other nodes after the heading
    // (keep only those that have text)
    // We'll get all children and process after heading
    let foundHeadline = false;
    Array.from(contentDiv.children).forEach(child => {
      if (!foundHeadline && child === headlineEl) {
        foundHeadline = true;
        return;
      }
      if (foundHeadline && (child.tagName === 'P' || child.tagName === 'DIV')) {
        if (child.textContent.trim()) {
          descriptionEls.push(child);
        }
      }
    });
  } else {
    // Fallback: look for picture/img and heading in element
    imageEl = element.querySelector('picture') || element.querySelector('img');
    headlineEl = element.querySelector('h1, h2, h3, h4, h5, h6');
    // Description: all paragraphs after heading
    let foundHeadline = false;
    Array.from(element.children).forEach(child => {
      if (!foundHeadline && child === headlineEl) {
        foundHeadline = true;
        return;
      }
      if (foundHeadline && child.tagName === 'P' && child.textContent.trim()) {
        descriptionEls.push(child);
      }
    });
  }

  // Second row: Image (optional, can be null)
  rows.push([imageEl ? imageEl : '']);

  // Third row: Headline and description (optional)
  const contentCell = [];
  if (headlineEl) contentCell.push(headlineEl);
  if (descriptionEls.length) contentCell.push(...descriptionEls);
  rows.push([contentCell.length ? (contentCell.length === 1 ? contentCell[0] : contentCell) : '']);

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
