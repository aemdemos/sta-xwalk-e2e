/* global WebImporter */
export default function parse(element, { document }) {
  // Only proceed if this is the main tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs38)'];

  // Find the tabs container (should be the direct child with class 'cmp-tabs')
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have at least one tab
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: each row is [tab label, tab content]
  const rows = tabLabels.map((labelEl, idx) => {
    // Tab label text
    const label = labelEl.textContent.trim();
    // Tab content: use the inner HTML of the tabpanel div (preserves all structure)
    const panel = tabPanels[idx];
    // Defensive: if no panel, just use empty string
    let content = '';
    if (panel) {
      // Instead of copying children, use the panel itself (to ensure DOM replacement)
      content = panel.cloneNode(true);
    }
    return [label, content];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabsContainer's parent (the .tabs element) with the new block table
  element.replaceWith(block);
}
