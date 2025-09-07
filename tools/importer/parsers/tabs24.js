/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the .tabs block
  if (!element.classList.contains('tabs')) return;

  // Block header row as required
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Find the cmp-tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if counts match
  if (tabLabels.length !== tabPanels.length) return;

  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return;
    // Clone the panel to avoid removing it from the DOM
    let contentElem = panel.cloneNode(true);
    // If the panel contains a single child (e.g. .contentfragment), use that child for cleaner output
    if (contentElem.children.length === 1) {
      contentElem = contentElem.firstElementChild.cloneNode(true);
    }
    rows.push([label, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the ENTIRE tabs block's parent (.tabs) with the table
  element.replaceWith(table);
}
