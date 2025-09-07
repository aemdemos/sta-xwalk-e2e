/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element.classList.contains('tabs')) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Find the tabs container (should be a cmp-tabs)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside ol[role="tablist"])
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    return;
  }

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main content fragment inside the panel
    let tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment');
    if (!tabContent) tabContent = panel;

    // Move the tabContent into the table cell (remove from DOM and append)
    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  element.replaceWith(blockTable);
}
