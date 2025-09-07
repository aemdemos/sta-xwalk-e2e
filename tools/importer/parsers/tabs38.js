/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Only process if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Find the corresponding panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // Tab content: use the contentfragment/article inside the panel if present, else the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
