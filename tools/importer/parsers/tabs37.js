/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: Find corresponding panel
    const panelEl = tabPanels[idx];
    if (!panelEl) return;

    // Tab label text
    const tabLabel = labelEl.textContent.trim();

    // Tab content: use the entire panel content
    // Defensive: Find the main content fragment inside the panel
    let tabContent = null;
    const contentFragment = panelEl.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panelEl itself
      tabContent = panelEl;
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
