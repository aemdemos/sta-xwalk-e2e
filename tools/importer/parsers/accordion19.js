/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment > article.cmp-contentfragment');
  if (!contentFragment) return;

  // Build the table header
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];

  // Get .cmp-contentfragment__elements
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper: flatten grids/columns, but keep meaningful content blocks
  function flattenBlocks(parent) {
    const blocks = [];
    for (const node of parent.childNodes) {
      if (node.nodeType === 1) { // element
        if (
          node.classList &&
          (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn'))
        ) {
          blocks.push(...flattenBlocks(node));
        } else {
          blocks.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // text node
        const span = document.createElement('span');
        span.textContent = node.textContent;
        blocks.push(span);
      }
    }
    return blocks;
  }

  // Collect all blocks in order
  const blocks = flattenBlocks(cfElements);

  // Split into accordion sections by h2 (must be direct h2, not inside other blocks)
  let sections = [];
  let current = { title: null, content: [] };
  for (let i = 0; i < blocks.length; i++) {
    const el = blocks[i];
    // Accept both h2 nodes and cmp-title blocks with h2
    if (el.tagName === 'H2') {
      if (current.title || current.content.length) {
        sections.push(current);
      }
      current = { title: el, content: [] };
    } else if (el.tagName === 'DIV' && el.classList && el.classList.contains('cmp-title') && el.querySelector('h2')) {
      if (current.title || current.content.length) {
        sections.push(current);
      }
      current = { title: el.querySelector('h2'), content: [] };
    } else {
      current.content.push(el);
    }
  }
  if (current.title || current.content.length) {
    sections.push(current);
  }

  // If the first section has no title, treat as Introduction
  if (!sections[0].title && sections[0].content.length) {
    const introTitle = document.createElement('span');
    introTitle.textContent = 'Introduction';
    rows.push([
      introTitle,
      sections[0].content.length === 1 ? sections[0].content[0] : sections[0].content,
    ]);
    sections = sections.slice(1);
  }

  // Add each accordion section as its own row
  for (const section of sections) {
    if (section.title && section.content.length) {
      rows.push([
        section.title,
        section.content.length === 1 ? section.content[0] : section.content,
      ]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
