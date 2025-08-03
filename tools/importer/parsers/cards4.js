/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> holding all <li> cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);
  // Start rows with header row exactly as per requirement
  const rows = [['Cards']];

  lis.forEach((li) => {
    // Prefer .cards-card-image and .cards-card-body (fallback to first/second div)
    let imgDiv = li.querySelector('.cards-card-image');
    let bodyDiv = li.querySelector('.cards-card-body');
    if (!imgDiv || !bodyDiv) {
      const divs = li.querySelectorAll(':scope > div');
      imgDiv = imgDiv || divs[0] || null;
      bodyDiv = bodyDiv || divs[1] || null;
    }
    // Only add rows for valid cards (must have both image and body)
    if (imgDiv && bodyDiv) {
      rows.push([imgDiv, bodyDiv]);
    }
  });

  // Replace element only if at least one card row exists (besides the header)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
