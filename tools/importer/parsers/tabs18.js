/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get all tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: If the panel contains a single contentfragment, use its content
    let content;
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // Otherwise, use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
