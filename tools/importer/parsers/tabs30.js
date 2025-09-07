/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row using the exact block name
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, collect label and content
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab panel content
    const panelEl = tabPanels[i];
    // Defensive: find the main content fragment inside the tab panel
    let tabContent = null;
    const cf = panelEl.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      // Use the actual referenced element, not a clone
      tabContent = cf;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panelEl.childNodes);
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
