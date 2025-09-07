/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Build rows: first row is header, then one row per tab (label, content)
  const rows = [];
  const headerRow = ['Tabs (tabs7)'];
  rows.push(headerRow);

  // For each tab, add [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
