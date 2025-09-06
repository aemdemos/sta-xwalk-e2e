/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs20)']);

  // For each tab, push a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find the first direct child that is not empty
    for (const child of panel.children) {
      if (child && child.childNodes.length > 0) {
        content = child;
        break;
      }
    }
    // Fallback to the panel itself if nothing found
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
