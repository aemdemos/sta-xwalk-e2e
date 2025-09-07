/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Build the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs13)']);

  // For each tab, get label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find the panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${panelId}`);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
