/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs35)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Get the label text
    const label = tabLabel.textContent.trim();
    // Defensive: get the corresponding panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // For tab content: grab the entire contentfragment/article inside the panel
    // (this is robust to variations and preserves structure)
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use the whole panel
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
