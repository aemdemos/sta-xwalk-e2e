/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the tabs block
  if (!element.querySelector('.cmp-tabs')) return;

  // Find the cmp-tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: each tab is a row [label, content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    // Find the main content inside the panel
    // Prefer the article/contentfragment if present
    let tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // Clone to avoid moving from DOM
    tabContent = tabContent.cloneNode(true);
    return [label, tabContent];
  });

  // Table header
  const headerRow = ['Tabs (tabs10)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element (the tabs wrapper)
  element.replaceWith(block);
}
