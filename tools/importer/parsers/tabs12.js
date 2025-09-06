/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements inside ol[role=tablist])
  const tabList = tabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure we have matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs12)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // The content is the entire tabpanel's content
    // We'll create a wrapper div to hold all children (to preserve structure)
    const contentWrapper = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => {
      contentWrapper.appendChild(node.cloneNode(true));
    });
    rows.push([label, contentWrapper]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
