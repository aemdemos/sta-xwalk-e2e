/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Get the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    // Defensive: get the corresponding panel
    const panel = tabPanels[i];
    if (!panel) return;

    // For content, use the entire tabpanel's content
    // If the tabpanel contains a .contentfragment, use that
    let content = panel.querySelector('.contentfragment') || panel;
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
