/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // fallback: try to pair by order, but skip if mismatch
    return;
  }

  // Build rows: header first
  const rows = [];
  const headerRow = ['Tabs (tabs37)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find the first element that is not a script/style/empty grid
    const candidates = Array.from(panel.children);
    content = candidates.find(
      el => el.nodeType === 1 && el.textContent.trim().length > 0
    ) || panel;

    // Place the content element directly in the cell
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
