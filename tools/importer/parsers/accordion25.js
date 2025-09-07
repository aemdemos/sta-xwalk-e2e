/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the article with class 'contentfragment')
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // The main content is inside the .cmp-contentfragment__elements
  const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrapper) return;

  // Always start with the required header row
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow];

  // Helper to flatten all children, including those inside <div>s
  function flattenChildren(node) {
    const out = [];
    for (const child of node.childNodes) {
      if (child.nodeType === 1 && child.tagName.toLowerCase() === 'div') {
        out.push(...flattenChildren(child));
      } else if (child.nodeType === 1 || child.nodeType === 3) {
        out.push(child);
      }
    }
    return out;
  }

  const allChildren = flattenChildren(elementsWrapper);

  let currentTitle = null;
  let currentContent = [];
  let foundFirstH2 = false;

  for (let i = 0; i < allChildren.length; i++) {
    const node = allChildren[i];
    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h2') {
      // If we already have a title, push the previous accordion item
      if (currentTitle && currentContent.length > 0) {
        // Ensure all text and elements are included in the content cell
        rows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice()
        ]);
      }
      currentTitle = node;
      currentContent = [];
      foundFirstH2 = true;
    } else if (foundFirstH2) {
      // After the first h2, collect all nodes until next h2
      // Ignore empty text nodes
      if (node.nodeType === 3 && !node.textContent.trim()) continue;
      currentContent.push(node);
    }
  }
  // Push the last accordion item
  if (currentTitle && currentContent.length > 0) {
    rows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent.slice()
    ]);
  }

  // Only replace if we found at least one accordion item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(table);
  }
}
