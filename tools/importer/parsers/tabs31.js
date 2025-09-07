/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only process if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    // Tab content: use the whole tabpanel div for resilience
    const panel = tabPanels[i];
    return [label, panel];
  });

  // Table header as specified
  const headerRow = ['Tabs (tabs31)'];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the tabs block with the table
  tabs.replaceWith(table);
}
