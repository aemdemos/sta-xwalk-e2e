/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if this is the main tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Find the cmp-tabs inside this block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only process if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Use the entire tabpanel content as a cell
    const cellContent = Array.from(panel.childNodes);
    rows.push([
      label,
      cellContent
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
