/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.closest('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the actual cmp-tabs element if not already
  const cmpTabs = tabsRoot.classList.contains('cmp-tabs') ? tabsRoot : tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only proceed if counts match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs34)']);

  // Each tab row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Use the entire tab panel content as the cell (clone to avoid moving nodes)
    const cellContent = Array.from(panel.childNodes).map(node => node.cloneNode(true));
    rows.push([
      label,
      cellContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
