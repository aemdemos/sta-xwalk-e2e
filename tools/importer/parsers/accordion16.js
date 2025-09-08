/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main article contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Find all accordion section titles (h2 inside .title)
  const sectionTitles = Array.from(elementsContainer.querySelectorAll('.title h2'));
  if (!sectionTitles.length) return;

  // We'll build an array of [title, content] for each accordion item
  const accordionRows = [];
  sectionTitles.forEach((h2, idx) => {
    // Find the .title container for this h2
    const titleDiv = h2.closest('.title');
    // Find all nodes between this .title and the next .title
    let contentNodes = [];
    let node = titleDiv.nextSibling;
    while (node) {
      // Stop if we reach the next .title
      if (node.nodeType === 1 && node.classList.contains('title')) break;
      // Accept any element with content, not just specific classes
      if (node.nodeType === 1) {
        if (
          node.classList.contains('image') ||
          node.classList.contains('cmp-text') ||
          node.tagName === 'P'
        ) {
          contentNodes.push(node);
        } else if (node.tagName === 'DIV' && node.childNodes.length) {
          // Flatten DIVs containing paragraphs/images/text blocks
          Array.from(node.childNodes).forEach((subnode) => {
            if (
              subnode.nodeType === 1 &&
              (subnode.tagName === 'P' || subnode.classList.contains('image') || subnode.classList.contains('cmp-text'))
            ) {
              contentNodes.push(subnode);
            }
          });
        }
      }
      node = node.nextSibling;
    }
    // If there is at least some content, add the row
    if (contentNodes.length) {
      accordionRows.push([
        h2,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes,
      ]);
    }
  });

  // If no rows, do not proceed
  if (!accordionRows.length) return;

  // Build the table
  const headerRow = ['Accordion (accordion16)'];
  const cells = [headerRow, ...accordionRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
