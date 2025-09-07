/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content fragment
  const contentFragment = element.querySelector('.contentfragment > article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content container inside the content fragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Helper to flatten all relevant elements in order (including text nodes)
  function flattenElements(container) {
    const out = [];
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
        out.push(...flattenElements(node));
      } else if (node.nodeType === 1 && node.classList.contains('aem-GridColumn')) {
        out.push(...flattenElements(node));
      } else if (node.nodeType === 1 && node.classList.contains('title')) {
        const h2 = node.querySelector('.cmp-title > h2');
        if (h2) out.push(h2);
      } else if (node.nodeType === 1 && node.classList.contains('image')) {
        out.push(node);
      } else if (node.nodeType === 1 && node.classList.contains('text')) {
        out.push(node);
      } else if (node.nodeType === 1 && node.tagName === 'DIV') {
        out.push(...flattenElements(node));
      } else if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        out.push(node);
      }
    });
    return out;
  }

  const flatElements = flattenElements(elementsContainer);

  // Build accordion rows: each H2 is a title, content is all following until next H2
  const accordionRows = [];
  let i = 0;
  while (i < flatElements.length) {
    const el = flatElements[i];
    if (el.nodeType === 1 && el.tagName === 'H2') {
      const title = el;
      const content = [];
      i++;
      while (i < flatElements.length && !(flatElements[i].nodeType === 1 && flatElements[i].tagName === 'H2')) {
        content.push(flatElements[i]);
        i++;
      }
      // Remove empty text nodes from start/end
      while (content.length && content[0].nodeType === 3 && !content[0].textContent.trim()) content.shift();
      while (content.length && content[content.length-1].nodeType === 3 && !content[content.length-1].textContent.trim()) content.pop();
      accordionRows.push([title, content]);
    } else {
      i++;
    }
  }

  // Fallback: treat the whole thing as one section if no H2s found
  if (accordionRows.length === 0) {
    const mainTitle = contentFragment.querySelector('.cmp-contentfragment__title');
    const allContent = Array.from(elementsContainer.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim());
    accordionRows.push([mainTitle, allContent]);
  }

  // Table header as required by block spec
  const headerRow = ['Accordion (accordion12)'];
  const cells = [headerRow, ...accordionRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
