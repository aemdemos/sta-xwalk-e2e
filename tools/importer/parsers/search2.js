/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section
  let searchSection = null;
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    const gridChildren = Array.from(grid.children);
    searchSection = gridChildren.find(child => child.classList.contains('search'));
    if (searchSection) {
      searchSection = searchSection.querySelector('section.cmp-search');
    }
  }
  if (!searchSection) {
    searchSection = element.querySelector('section.cmp-search');
  }

  // Get the query index absolute URL
  let queryIndexUrl = '';
  if (searchSection) {
    const form = searchSection.querySelector('form');
    if (form) {
      const action = form.getAttribute('action');
      if (action && /\.searchresults\.json\/_jcr_content\/.+\/search$/.test(action)) {
        queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
      } else if (action) {
        try {
          queryIndexUrl = new URL(action, document.location.origin).href;
        } catch (e) {
          queryIndexUrl = action;
        }
      }
    }
  }

  // Build the table rows
  const headerRow = ['Search (search2)'];
  const urlRow = [queryIndexUrl];

  // Create the block table
  const cells = [headerRow, urlRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
