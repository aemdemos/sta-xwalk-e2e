/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the main article content
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area with sections
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Get all direct children in order
  const children = Array.from(elementsRoot.children);

  // Find all accordion sections: each is a .title (with h2) followed by content until next .title (with h2) or end
  const sections = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (
      node.tagName === 'DIV' &&
      node.classList.contains('title') &&
      node.querySelector('h2')
    ) {
      // This is a section header
      const title = node.querySelector('h2').cloneNode(true);
      i++;
      // Gather all content nodes until next section or end
      const contentNodes = [];
      while (
        i < children.length &&
        !(
          children[i].tagName === 'DIV' &&
          children[i].classList.contains('title') &&
          children[i].querySelector('h2')
        )
      ) {
        contentNodes.push(children[i].cloneNode(true));
        i++;
      }
      // Filter out empty nodes
      const filtered = contentNodes.filter(n => {
        if (n.tagName === 'DIV' && n.innerHTML.trim() === '') return false;
        if (n.tagName === 'P' && n.textContent.trim() === '') return false;
        return true;
      });
      let content;
      if (filtered.length === 1) {
        content = filtered[0];
      } else if (filtered.length > 1) {
        const wrapper = document.createElement('div');
        filtered.forEach(n => wrapper.appendChild(n));
        content = wrapper;
      } else {
        content = document.createElement('div');
      }
      sections.push([title, content]);
    } else {
      i++;
    }
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion11)'];
  const rows = [headerRow];
  sections.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Only create the block if there are sections
  if (sections.length > 0) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the ENTIRE content fragment, not just the root element
    contentFragment.replaceWith(block);
  }
}
