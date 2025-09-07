/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: reference the panel's content
    const panel = tabPanels[i];
    // Defensive: find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    // If not found, use the panel itself
    const tabContent = contentFragment || panel;
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
