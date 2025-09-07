/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // Find the tabs container (should be the direct child with class 'cmp-tabs')
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure same number of labels and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    const tabLabel = label.textContent.trim();
    // Instead of using a fragment, use innerHTML to get all content as a string
    const tabContentHTML = panel.innerHTML;
    // Create a container div and set its innerHTML
    const tabContentDiv = document.createElement('div');
    tabContentDiv.innerHTML = tabContentHTML;
    rows.push([tabLabel, tabContentDiv]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  element.replaceWith(table);
}
