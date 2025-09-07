/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element;
  // Header row as per spec
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Find the tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Find all tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure equal number of tabs and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: Find the main content inside the tab panel
    // Usually a single .contentfragment or similar
    let tabContent = null;
    // Try to find the main contentfragment/article
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // If not found, fallback to the panel itself
    // Place the label and content in the row
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  tabsRoot.replaceWith(block);
}
