/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the article with the contentfragment)
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // The actual content is inside the nested article.cmp-contentfragment
  const cfArticle = contentFragment.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // The elements are inside .cmp-contentfragment__elements
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Always start with the header row
  const rows = [ ['Accordion (accordion11)'] ];

  // We'll use a flat array of nodes for easier traversal
  const cfNodes = Array.from(cfElements.childNodes).filter((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) return true;
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) return true;
    return false;
  });

  let i = 0;
  while (i < cfNodes.length) {
    const node = cfNodes[i];
    // Look for a title (h2 inside .cmp-title)
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.matches('div') &&
      node.querySelector('.cmp-title__text') &&
      node.querySelector('.cmp-title__text').tagName.toLowerCase() === 'h2'
    ) {
      const titleEl = node.querySelector('.cmp-title__text');
      i++;
      // Gather all nodes until the next h2 title
      const contentEls = [];
      while (i < cfNodes.length) {
        const nextNode = cfNodes[i];
        if (
          nextNode.nodeType === Node.ELEMENT_NODE &&
          nextNode.matches('div') &&
          nextNode.querySelector('.cmp-title__text') &&
          nextNode.querySelector('.cmp-title__text').tagName.toLowerCase() === 'h2'
        ) {
          break;
        }
        // Only add elements with actual content
        if (
          (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.textContent.trim()) ||
          (nextNode.nodeType === Node.TEXT_NODE && nextNode.textContent.trim())
        ) {
          contentEls.push(nextNode);
        }
        i++;
      }
      // Only add row if there is content for the accordion item
      if (contentEls.length > 0) {
        // If only one element, use it; if multiple, use an array
        const contentCell = contentEls.length === 1 ? contentEls[0] : contentEls;
        rows.push([titleEl, contentCell]);
      }
    } else {
      i++;
    }
  }

  // Defensive: If no accordion item rows found, do nothing
  if (rows.length === 1) return;

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original contentfragment with the table
  contentFragment.replaceWith(table);
}
