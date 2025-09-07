/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: header first
  const rows = [ ['Tabs (tabs15)'] ];

  // For each tab, find its label and content
  tabLabels.forEach((tabLabel) => {
    const label = tabLabel.textContent.trim();
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabPanels.find(panel => panel.id === tabPanelId);
    if (!tabPanel) return;
    // Use all children of tabPanel as content
    const contentNodes = Array.from(tabPanel.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
    });
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
