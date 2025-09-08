/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the tabs block
  if (!element.classList.contains('cmp-tabs')) return;

  // Get tab labels
  const tabList = element.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Tabs (tabs35)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if no panel
    if (!panel) continue;

    // Use the entire panel as content (clone to avoid DOM removal)
    const contentCell = panel.cloneNode(true);
    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
