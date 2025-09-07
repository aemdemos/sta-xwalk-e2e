/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: header first
  const rows = [
    ['Tabs (tabs27)']
  ];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: match tab panel by index
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Prefer the first direct child that is not a script/style/empty
    for (const child of panel.children) {
      if (child.nodeType === 1 && child.textContent.trim().length > 0) {
        content = child;
        break;
      }
    }
    // Fallback: use the panel itself
    if (!content) content = panel;

    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
