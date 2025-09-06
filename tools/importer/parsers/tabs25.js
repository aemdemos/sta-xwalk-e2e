/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per block spec
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // Get tab labels (li elements)
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Get all content inside the tab panel
    // Use the panel itself as the cell value (preserves all content and elements)
    rows.push([label, panel.cloneNode(true)]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  element.replaceWith(table);
}
