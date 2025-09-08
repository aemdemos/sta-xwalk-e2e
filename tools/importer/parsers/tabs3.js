/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tab blocks
  if (!element || !element.classList.contains('tabs')) return;

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content inside the panel
    // Usually a .contentfragment or similar
    let content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // Instead of cloning, extract the HTML as a string and create a fragment
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content.innerHTML;
    // Use the fragment as the cell content
    rows.push([label, Array.from(tempDiv.childNodes)]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
