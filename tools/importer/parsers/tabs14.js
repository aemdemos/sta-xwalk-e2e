/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if this is the tabs block
  if (!element.querySelector('.cmp-tabs')) return;

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Always use the target block name as the header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Use the panel's HTML content as a string
      const frag = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
      contentCell = Array.from(frag.childNodes);
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
