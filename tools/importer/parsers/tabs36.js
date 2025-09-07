/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tabpanel elements
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows for each tab
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Defensive: Find the corresponding tabpanel
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Use the entire tabpanel content as the cell
      // Defensive: If tabpanel contains a single .contentfragment, use its content
      const contentFragment = panel.querySelector('.contentfragment') || panel;
      tabContent = contentFragment;
    } else {
      tabContent = document.createTextNode('');
    }
    rows.push([label, tabContent]);
  }

  // Header row
  const headerRow = ['Tabs (tabs36)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
