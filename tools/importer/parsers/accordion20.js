/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all children for easier traversal
  const children = Array.from(cfElements.children);

  // Build header row
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find all h2 titles and their content blocks
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    let titleElem = null;
    if (node.querySelector && node.querySelector('h2')) {
      titleElem = node.querySelector('h2');
    }
    if (titleElem) {
      // Collect all content until next h2 or end
      const contentBlocks = [];
      i++;
      while (i < children.length) {
        const nextNode = children[i];
        if (nextNode.querySelector && nextNode.querySelector('h2')) break;
        // Skip empty grid wrappers
        if (nextNode.classList && nextNode.classList.contains('aem-Grid')) {
          i++;
          continue;
        }
        // Only push if not empty
        if (nextNode.textContent.trim() !== '' || nextNode.children.length > 0) {
          contentBlocks.push(nextNode.cloneNode(true));
        }
        i++;
      }
      // If there is any content, add the row
      if (contentBlocks.length > 0) {
        rows.push([
          titleElem.cloneNode(true),
          contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks,
        ]);
      }
    } else {
      i++;
    }
  }

  // Only create the table if there is at least one accordion item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the root element (not just the contentfragment) so the block is output
    element.replaceWith(table);
  }
}
