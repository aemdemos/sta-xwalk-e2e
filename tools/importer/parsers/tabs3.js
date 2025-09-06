/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is the tabs block
  if (!element.classList.contains('tabs')) return;

  // Find the cmp-tabs element inside this block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  const tabRows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Use the entire tabpanel div for content
    // CLONE the tabPanel node so that replaceWith does not remove the original content
    const content = tabPanels[i].cloneNode(true);
    tabRows.push([label, content]);
  }

  // Build the table rows
  const headerRow = ['Tabs (tabs3)'];
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block element with the block table
  element.replaceWith(block);
}
