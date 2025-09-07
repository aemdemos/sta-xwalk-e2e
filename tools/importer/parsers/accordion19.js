/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main article contentfragment block
  const cf = element.querySelector('.contentfragment');
  if (!cf) return;

  // Find the actual contentfragment article
  const cfArticle = cf.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // Find the main content container inside the contentfragment
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper to collect accordion items
  const items = [];

  // --- Introduction (all nodes before first h2) ---
  const h2Titles = Array.from(cfElements.querySelectorAll('h2.cmp-title__text'));
  let introNodes = [];
  let sibling = cfElements.firstChild;
  let firstH2 = h2Titles.length > 0 ? h2Titles[0].closest('.cmp-title') : null;
  while (sibling && sibling !== firstH2) {
    if (sibling.nodeType === 1 && sibling.matches('p')) {
      introNodes.push(sibling);
    }
    if (sibling.nodeType === 1 && sibling.querySelector && sibling.querySelector('blockquote')) {
      introNodes.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  if (introNodes.length > 0) {
    items.push([
      'Introduction',
      introNodes.length === 1 ? introNodes[0] : introNodes
    ]);
  }

  // --- For each h2, collect content until the next h2 ---
  for (let i = 0; i < h2Titles.length; i++) {
    const titleEl = h2Titles[i];
    const title = titleEl.textContent.trim();
    let parent = titleEl.closest('.cmp-title');
    let contentNodes = [];
    let sibling = parent.nextSibling;
    while (sibling) {
      // If next h2, break
      if (sibling.nodeType === 1 && sibling.matches('.cmp-title')) {
        const h2Check = sibling.querySelector('h2.cmp-title__text');
        if (h2Check) break;
      }
      // Defensive: skip grid wrappers but grab images inside
      if (sibling.nodeType === 1 && sibling.matches('div.aem-Grid')) {
        const img = sibling.querySelector('.cmp-image');
        if (img) contentNodes.push(img);
        sibling = sibling.nextSibling;
        continue;
      }
      // Defensive: skip empty divs
      if (sibling.nodeType === 1 && sibling.matches('div')) {
        sibling = sibling.nextSibling;
        continue;
      }
      // Add paragraphs, images, etc
      if (
        sibling.nodeType === 1 &&
        (sibling.matches('p') || sibling.matches('.cmp-image'))
      ) {
        contentNodes.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    if (contentNodes.length > 0) {
      items.push([
        title,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes
      ]);
    }
  }

  // Header row: must be 1 column only
  const headerRow = ['Accordion (accordion19)'];
  // Each data row must be 2 columns: title, content
  const cells = [headerRow, ...items];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
