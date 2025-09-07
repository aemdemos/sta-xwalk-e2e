/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: header first, then one row per tab (label, content)
  const cells = [];
  const headerRow = ['Tabs (tabs25)'];
  cells.push(headerRow);

  // Defensive: ensure labels and panels match
  const numTabs = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content inside the tab panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }

    cells.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
