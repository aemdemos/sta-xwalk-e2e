/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element (the main tabs container)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs33)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Extract the content of the tab panel
    // We'll use all children of the tabpanel as the content
    const contentDiv = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => contentDiv.appendChild(node.cloneNode(true)));
    rows.push([label, contentDiv]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the cmpTabs with the new table
  cmpTabs.replaceWith(table);
}
