/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row per example
  const headerRow = ['Search (search1)'];

  // Example markdown specifies a single URL -- this must be present in the output. Per the block's description and example,
  // this value must be the absolute URL to the site's query index, not something extracted from the HTML.
  // The source HTML does not contain a query index URL, so we must use the standard default as in the example (this is the only way to ensure correct import, as the visual and code example show only this).
  const url = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  // Make a link element pointing to the query index
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;
  // Build table: header row, content row
  const rows = [
    headerRow,
    [link],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
