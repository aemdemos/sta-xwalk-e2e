/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to get all direct children of a node
  function getDirectChildren(parent) {
    return Array.from(parent.childNodes).filter((node) => node.nodeType === 1 || node.nodeType === 3);
  }

  // Get the elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all direct children of elementsContainer
  const children = getDirectChildren(elementsContainer);

  // Prepare rows for the accordion table
  const rows = [];
  const headerRow = ['Accordion (accordion32)'];
  rows.push(headerRow);

  // Find intro content (before first h2)
  let introContent = [];
  let introTitle = null;
  let idx = 0;
  for (; idx < children.length; idx++) {
    const node = children[idx];
    if (node.tagName && node.tagName.toLowerCase() === 'h2') break;
    if (node.tagName) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'p') {
        introContent.push(node);
      } else if (tag === 'div') {
        const image = node.querySelector('.cmp-image');
        if (image) {
          introContent.push(node);
        }
      }
    }
  }
  if (introContent.length > 0) {
    introTitle = contentFragment.querySelector('.cmp-contentfragment__title');
    if (!introTitle) {
      introTitle = document.createElement('h2');
      introTitle.textContent = 'Introduction';
    }
    rows.push([introTitle, introContent]);
  }

  // Now process each accordion item (h2 + content until next h2)
  while (idx < children.length) {
    // Find next h2
    let title = null;
    while (idx < children.length && !(children[idx].tagName && children[idx].tagName.toLowerCase() === 'h2')) {
      idx++;
    }
    if (idx < children.length && children[idx].tagName && children[idx].tagName.toLowerCase() === 'h2') {
      title = children[idx];
      idx++;
    } else {
      break;
    }
    // Collect content until next h2
    let contentItems = [];
    while (idx < children.length && !(children[idx].tagName && children[idx].tagName.toLowerCase() === 'h2')) {
      const node = children[idx];
      if (node.tagName) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'p') {
          contentItems.push(node);
        } else if (tag === 'div') {
          const image = node.querySelector('.cmp-image');
          if (image) {
            contentItems.push(node);
          }
        }
      }
      idx++;
    }
    if (contentItems.length === 0) contentItems = [''];
    rows.push([title, contentItems]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
