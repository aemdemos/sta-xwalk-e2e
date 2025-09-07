/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const elementsDiv = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsDiv) return;

  // Collect all nodes in order (including nested ones)
  const allNodes = [];
  elementsDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.matches('div.aem-Grid')) {
      // Flatten children of grid
      node.childNodes.forEach((n) => allNodes.push(n));
    } else {
      allNodes.push(node);
    }
  });

  // Find all accordion sections: each h2 and all content up to next h2
  const accordionRows = [];
  let i = 0;
  while (i < allNodes.length) {
    const node = allNodes[i];
    let h2 = null;
    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector && node.querySelector('h2.cmp-title__text')) {
      h2 = node.querySelector('h2.cmp-title__text');
    }
    if (h2) {
      // Gather all content nodes until next h2
      const contentNodes = [];
      i++;
      while (i < allNodes.length) {
        const nextNode = allNodes[i];
        let isNextTitle = false;
        if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.querySelector && nextNode.querySelector('h2.cmp-title__text')) {
          isNextTitle = true;
        }
        if (isNextTitle) break;
        contentNodes.push(nextNode);
        i++;
      }
      // Remove leading/trailing whitespace nodes
      while (contentNodes.length && contentNodes[0].nodeType === Node.TEXT_NODE && !contentNodes[0].textContent.trim()) contentNodes.shift();
      while (contentNodes.length && contentNodes[contentNodes.length-1] && contentNodes[contentNodes.length-1].nodeType === Node.TEXT_NODE && !contentNodes[contentNodes.length-1].textContent.trim()) contentNodes.pop();
      // Only add if there is content
      if (contentNodes.length > 0) {
        const frag = document.createDocumentFragment();
        contentNodes.forEach(n => frag.appendChild(n.cloneNode(true)));
        accordionRows.push([h2.cloneNode(true), frag]);
      }
    } else {
      i++;
    }
  }

  if (accordionRows.length === 0) return;
  const headerRow = ['Accordion (accordion6)'];
  const tableRows = [headerRow, ...accordionRows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  contentFragment.replaceWith(table);
}
