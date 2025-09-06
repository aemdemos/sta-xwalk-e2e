/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = document.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  const headerRow = ['Tabs (tabs17)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;
    // Use the entire panel content as the cell
    const contentElements = Array.from(panel.childNodes);
    // Remove empty text nodes
    const filteredContent = contentElements.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    rows.push([
      label,
      filteredContent.length === 1 ? filteredContent[0] : filteredContent
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabsRoot with the table
  tabsRoot.replaceWith(table);
}
