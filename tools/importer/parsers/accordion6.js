/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the main article contentfragment
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;

  // Find the main content area
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all children nodes
  const children = Array.from(elementsContainer.children);

  // Find all h2 sections and their content
  const sections = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    let titleEl = null;
    if (node.classList && node.classList.contains('title')) {
      const h2 = node.querySelector('h2');
      if (h2) {
        titleEl = h2;
        i++;
        // Gather all content until next h2 title or end
        const contentEls = [];
        while (i < children.length) {
          const nextNode = children[i];
          if (nextNode.classList && nextNode.classList.contains('title') && nextNode.querySelector('h2')) {
            break;
          }
          // If image block, include
          if (nextNode.classList && nextNode.classList.contains('image')) {
            const imgBlock = nextNode.querySelector('.cmp-image');
            if (imgBlock) contentEls.push(imgBlock);
          }
          // If paragraph, include
          if (nextNode.tagName === 'P') {
            contentEls.push(nextNode);
          }
          // If div, include all paragraphs and images inside
          if (nextNode.tagName === 'DIV') {
            const imgs = nextNode.querySelectorAll('.cmp-image');
            imgs.forEach(img => contentEls.push(img));
            const ps = nextNode.querySelectorAll('p');
            ps.forEach(p => contentEls.push(p));
          }
          i++;
        }
        sections.push([titleEl, contentEls.length === 1 ? contentEls[0] : contentEls]);
        continue;
      }
    }
    i++;
  }

  // Build table rows
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];
  sections.forEach(([titleEl, contentCell]) => {
    rows.push([titleEl, contentCell]);
  });

  // Only output if there is at least one accordion row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
