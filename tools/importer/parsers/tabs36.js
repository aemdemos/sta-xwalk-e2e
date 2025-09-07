/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only proceed if we have labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows for the table
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, idx) => {
    // Defensive: Some tabs may not have a matching panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // For tab content, reference the entire panel content
    // Usually the panel contains a .contentfragment > article
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
