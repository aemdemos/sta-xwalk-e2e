/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Find all accordion sections (h2 titles)
  const sectionTitles = Array.from(elementsContainer.querySelectorAll('.title.cmp-title--underline h2'));
  if (!sectionTitles.length) return;

  // Prepare rows
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Helper: get all nodes between two elements
  function getContentBetween(startElem, endElem) {
    const contentNodes = [];
    let node = startElem.nextSibling;
    while (node && node !== endElem) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        contentNodes.push(p);
      } else if (node.nodeType === 1) {
        // Element node
        if (node.textContent.trim() || node.querySelector('img')) {
          contentNodes.push(node);
        }
      }
      node = node.nextSibling;
    }
    return contentNodes;
  }

  // Build accordion rows
  sectionTitles.forEach((h2, idx) => {
    const titleBlock = h2.closest('.title.cmp-title--underline');
    // Find the next titleBlock
    let nextTitleBlock = null;
    for (let i = idx + 1; i < sectionTitles.length; i++) {
      nextTitleBlock = sectionTitles[i].closest('.title.cmp-title--underline');
      if (nextTitleBlock) break;
    }
    // Collect all content between current titleBlock and nextTitleBlock
    const contentNodes = getContentBetween(titleBlock, nextTitleBlock);
    // Only add rows if content exists
    if (contentNodes.length > 0) {
      const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
      rows.push([h2, contentCell]);
    }
  });

  // Only proceed if there is at least one accordion row
  if (rows.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
