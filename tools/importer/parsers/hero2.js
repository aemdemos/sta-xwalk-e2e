/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get first direct descendant matching selector
  function firstDirectDescendant(el, selector) {
    return Array.from(el.children).find(child => child.matches(selector));
  }

  // Find the hero block inside the container
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return; // Defensive: Skip if not found

  // Find the inner content div
  let contentDiv = heroBlock;
  // Sometimes nested divs (common in AEM blocks)
  while (contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // 2nd row: background image (picture or img)
  let bgImage = null;
  // Look for a <picture> or <img> in the first <p>
  const maybeFirstP = firstDirectDescendant(contentDiv, 'p');
  if (maybeFirstP) {
    bgImage = maybeFirstP.querySelector('picture,img');
  } else {
    // Fallback: look for first picture/img in contentDiv
    bgImage = contentDiv.querySelector('picture,img');
  }

  // 3rd row: heading, subheading, cta, etc
  // Gather all elements after the image-containing <p>
  const contentEls = [];
  let addedHeading = false;
  Array.from(contentDiv.children).forEach(child => {
    if (child === maybeFirstP) {
      // skip image <p> here, already handled
      return;
    }
    // If there is a heading, include it
    if (/^H[1-6]$/.test(child.tagName)) {
      contentEls.push(child);
      addedHeading = true;
      return;
    }
    // Accept <p>, <div>, etc. (not empty)
    if (
      (child.tagName === 'P' || child.tagName === 'DIV') &&
      child.textContent.trim() !== ''
    ) {
      contentEls.push(child);
    }
    // (If any CTAs are present, likely a <a> inside <p> or <div> -- these are included too)
  });
  // If no heading found at all, fallback to any heading in contentDiv
  if (!addedHeading) {
    const fallbackHeading = contentDiv.querySelector('h1,h2,h3');
    if (fallbackHeading) contentEls.unshift(fallbackHeading);
  }

  // Compose rows for the table
  const rows = [
    ['Hero'],
    [bgImage].filter(Boolean),
    [contentEls.length ? contentEls : ''].filter(row => row[0])
  ];
  // Remove empty rows at end
  while (rows.length > 1 && rows[rows.length - 1].length && !rows[rows.length - 1][0]) {
    rows.pop();
  }

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
