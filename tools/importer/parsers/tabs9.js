/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header: must match block name exactly
  const headerRow = ['Tabs (tabs9)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab panel content
    const panelEl = tabPanels[idx];
    if (!panelEl) return;

    // Find the main content fragment inside the panel
    let contentFragment = panelEl.querySelector('article') || panelEl;

    // Use the actual DOM node (do not clone or create new)
    rows.push([labelText, contentFragment]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
