/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element.classList.contains('tabs')) return;

  // Find the cmp-tabs element
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: match count
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Build table rows
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  for (let i = 0; i < count; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Get the main contentfragment or fallback to panel
    let content = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (!content) content = panel;
    // Use innerHTML to ensure content is not moved from DOM
    const cell = document.createElement('div');
    cell.innerHTML = content.innerHTML;
    rows.push([label, cell]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block
  element.replaceWith(block);
}
