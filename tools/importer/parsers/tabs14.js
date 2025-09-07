/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header first
  const cells = [ ['Tabs (tabs14)'] ];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) return;
    // Clone the panel so we don't move it from the DOM
    const content = panel.cloneNode(true);
    cells.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block element with the block table
  element.replaceWith(block);
}
