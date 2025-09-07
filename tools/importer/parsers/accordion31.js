/* global WebImporter */
export default function parse(element, { document }) {
  function getMainContent(el) {
    return el.querySelector('article.contentfragment');
  }

  function extractAccordionItems(contentFragment) {
    const items = [];
    const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
    const rootDiv = contentFragment.querySelector('.cmp-contentfragment__elements');
    if (!rootDiv) return items;
    // Get all children (preserving order)
    const children = Array.from(rootDiv.children);
    // Find all h2s and their indices
    const h2Indices = [];
    children.forEach((c, i) => {
      const h2 = c.querySelector && c.querySelector('h2.cmp-title__text');
      if (h2) h2Indices.push(i);
    });
    // First section: before first h2
    if (mainTitle && h2Indices.length > 0) {
      const content = [];
      for (let i = 0; i < h2Indices[0]; i++) {
        const node = children[i];
        if (
          node.matches('p, blockquote, div.image, div.text') ||
          (node.querySelector && node.querySelector('img'))
        ) {
          content.push(node);
        }
      }
      if (content.length > 0) {
        items.push([mainTitle, content]);
      }
    }
    // For each h2, collect until next h2
    for (let h = 0; h < h2Indices.length; h++) {
      const idx = h2Indices[h];
      const titleDiv = children[idx].querySelector('h2.cmp-title__text');
      const nextIdx = h2Indices[h + 1] !== undefined ? h2Indices[h + 1] : children.length;
      const content = [];
      for (let i = idx + 1; i < nextIdx; i++) {
        const node = children[i];
        if (
          node.matches('p, blockquote, div.image, div.text') ||
          (node.querySelector && node.querySelector('img'))
        ) {
          content.push(node);
        }
      }
      if (titleDiv && content.length > 0) {
        items.push([titleDiv, content]);
      }
    }
    return items;
  }

  const contentFragment = getMainContent(element);
  if (!contentFragment) return;
  const accordionItems = extractAccordionItems(contentFragment);
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];
  accordionItems.forEach(([titleEl, contentArr]) => {
    if (titleEl && contentArr && contentArr.length > 0) {
      rows.push([titleEl, contentArr]);
    }
  });
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
