/* global WebImporter */

export default function parse(element, { document }) {
  // Helper to add field comment before content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the image (picture)
  const picture = element.querySelector('picture');
  // Find the heading (h1)
  const heading = element.querySelector('h1');

  // Table header row must match block name exactly
  const headerRow = ['Hero (hero2)'];
  // Image row: only reference the existing element, do not clone
  const imageRow = [picture ? fieldFragment('image', picture) : ''];
  // Text row: only reference the existing element, do not clone
  const textRow = [heading ? fieldFragment('text', heading) : ''];

  // Compose table
  const rows = [
    headerRow,
    imageRow,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
