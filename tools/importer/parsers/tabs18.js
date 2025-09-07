/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block by class
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be the same as tabsBlock)
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(cmpTabs.querySelectorAll('ol[role=tablist] > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role=tabpanel]'));

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row as per block guidelines
  rows.push(['Tabs (tabs18)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: match tabpanel by aria-labelledby
    let panel = tabPanels.find(
      (p) => p.getAttribute('aria-labelledby') === tabLabels[i].id
    );
    if (!panel) {
      // fallback: use index
      panel = tabPanels[i];
    }
    // Tab content: use the entire tabpanel content
    // Defensive: remove aria-hidden panels if present
    if (panel && panel.hasAttribute('aria-hidden') && panel.getAttribute('aria-hidden') === 'true') {
      // Still include the content, as per block guidelines
    }
    // For robustness, use the first child of tabpanel if it's a wrapper
    let tabContent = panel;
    // If the panel has a single child that is a .contentfragment, use that
    if (panel && panel.children.length === 1 && panel.firstElementChild.classList.contains('contentfragment')) {
      tabContent = panel.firstElementChild;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
