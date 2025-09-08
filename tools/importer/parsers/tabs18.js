/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs18)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Defensive: If label is empty, skip
    if (!labelText) continue;

    // Tab content: find the contentfragment/article inside the panel
    const panel = tabPanels[i];
    let tabContent = null;
    // Use the entire tabpanel content for resilience
    if (panel) {
      // If there's a contentfragment/article, use that; else, use panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;
      tabContent = contentFragment;
    }
    rows.push([labelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
