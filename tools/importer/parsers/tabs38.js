/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Use aria-controls to match tab to panel
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${panelId}`);
    // Defensive: fallback to index if not found
    const tabContent = panel || tabPanels[idx];
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Defensive: if no content, skip
    if (!labelText || !tabContent) return null;
    return [labelText, tabContent];
  }).filter(Boolean);

  // Table header
  const headerRow = ['Tabs (tabs38)'];

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
