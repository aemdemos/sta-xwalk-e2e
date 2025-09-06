/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Find all .cmp-title h2 sections and their content
  const rows = [];
  // We'll use all h2s as section titles
  const h2s = elementsContainer.querySelectorAll('.cmp-title h2');
  h2s.forEach((h2, idx) => {
    // Find the parent .title
    const titleDiv = h2.closest('.title');
    // Gather all siblings after this .title until the next .title or end
    let content = [];
    let node = titleDiv.nextElementSibling;
    while (node && !(node.classList && node.classList.contains('title') && node.querySelector('h2'))) {
      // If image block, grab image
      if (node.classList && node.classList.contains('image')) {
        const img = node.querySelector('img');
        if (img) content.push(img);
      }
      // If paragraph or blockquote, include
      if (node.tagName === 'P' || node.tagName === 'BLOCKQUOTE') {
        content.push(node);
      }
      // If it's a div containing paragraphs or blockquotes, include all
      if (node.tagName === 'DIV') {
        const ps = node.querySelectorAll('p, blockquote');
        ps.forEach((p) => content.push(p));
      }
      node = node.nextElementSibling;
    }
    // If no content found, try to find paragraphs inside the next .aem-Grid after the title
    if (!content.length && titleDiv.parentElement) {
      let grid = titleDiv.nextElementSibling;
      if (grid && grid.classList && grid.classList.contains('aem-Grid')) {
        const ps = grid.querySelectorAll('p, blockquote');
        ps.forEach((p) => content.push(p));
      }
    }
    // If still no content, try to find paragraphs after the .title
    if (!content.length) {
      let fallback = titleDiv.nextElementSibling;
      while (fallback && !fallback.classList.contains('title')) {
        if (fallback.tagName === 'P' || fallback.tagName === 'BLOCKQUOTE') {
          content.push(fallback);
        }
        fallback = fallback.nextElementSibling;
      }
    }
    if (content.length) {
      rows.push([h2, content.length === 1 ? content[0] : content]);
    }
  });

  if (!rows.length) return;

  // Build block table
  const cells = [
    ['Accordion (accordion6)'],
    ...rows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the entire content fragment with the block
  contentFragment.replaceWith(block);
}
