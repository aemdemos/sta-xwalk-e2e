/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();

    // Defensive: Find the matching panel by aria-controls
    let panelEl = tabPanels.find(panel => {
      return panel.getAttribute('aria-labelledby') === labelEl.id;
    });
    // Fallback: Use index if not found
    if (!panelEl) panelEl = tabPanels[i];
    if (!panelEl) return;

    // Tab content: Use the entire contentfragment/article inside the panel
    // Usually a single .contentfragment > article
    let contentFragment = panelEl.querySelector('.contentfragment > article') || panelEl.querySelector('article');
    // If not found, use the panel itself
    const tabContent = contentFragment || panelEl;

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
