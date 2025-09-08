/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block (could be the element itself or a child)
  let tabsBlock = element;
  if (!tabsBlock.classList.contains('cmp-tabs')) {
    tabsBlock = element.querySelector('.cmp-tabs');
  }
  if (!tabsBlock) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Tab content: grab everything inside the tabpanel
    // Usually a single .contentfragment, but could be more
    const tabContentElements = [];
    // Only include direct children (not the tabpanel itself)
    Array.from(panel.children).forEach(child => {
      tabContentElements.push(child);
    });

    // If only one element, use it directly; else, use array
    const tabContentCell = tabContentElements.length === 1 ? tabContentElements[0] : tabContentElements;

    rows.push([label, tabContentCell]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
