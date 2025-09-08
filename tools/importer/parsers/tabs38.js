/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Find the main content inside the tab panel
    // Use the first .contentfragment or article if present, else the panel itself
    let tabContent = tabPanel.querySelector('.contentfragment, article, .cmp-contentfragment__elements');
    if (!tabContent) tabContent = tabPanel;

    // Reference the existing element (do not clone)
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
