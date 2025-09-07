/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row must match block name exactly
  rows.push(['Tabs (tabs9)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main content inside the tab panel
    // Use the first article or .contentfragment, else fallback to panel
    let content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // Defensive: If content is empty, insert an empty div
    if (!content || !content.textContent.trim()) {
      content = document.createElement('div');
    }

    // Reference the existing element (do not clone)
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
