/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find direct descendant by class
  function findDescendantByClass(parent, className) {
    const stack = [parent];
    while (stack.length) {
      const curr = stack.pop();
      if (curr.classList && curr.classList.contains(className)) return curr;
      for (const child of curr.children) {
        stack.push(child);
      }
    }
    return null;
  }

  // Find the hero block - optimize for variations
  let heroBlock = findDescendantByClass(element, 'hero');
  if (!heroBlock) heroBlock = element;

  // Find the block's main content area (usually a <div> containing all)
  let contentDiv = heroBlock;
  // For robust extraction, use first <div> containing both an image and heading
  const divs = heroBlock.querySelectorAll('div');
  for (const d of divs) {
    if (d.querySelector('img, picture') && d.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentDiv = d;
      break;
    }
  }

  // 1st content row: Background image (picture or img)
  let bgImage = null;
  // Find first <picture> or <img> in contentDiv
  bgImage = contentDiv.querySelector('picture');
  if (!bgImage) {
    bgImage = contentDiv.querySelector('img');
  }

  // 2nd content row: Text content (headings, subheadings, CTA/links)
  let contentCellParts = [];
  // Heading
  let heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) contentCellParts.push(heading);
  // Subheading: a <p> after the heading that is not just empty or whitespace
  if (heading) {
    let next = heading.nextElementSibling;
    while (next) {
      if (next.tagName.toLowerCase() === 'p' && next.textContent.trim()) {
        contentCellParts.push(next);
      }
      next = next.nextElementSibling;
    }
  } else {
    // Fallback: find non-empty <p>s in contentDiv
    const allParas = [...contentDiv.querySelectorAll('p')].filter(p => p.textContent.trim());
    contentCellParts = contentCellParts.concat(allParas);
  }
  // If nothing found, avoid empty cell
  if (contentCellParts.length === 0) contentCellParts = [''];

  // Compose rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [bgImage ? bgImage : ''];
  const contentRow = [contentCellParts.length === 1 ? contentCellParts[0] : contentCellParts];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
