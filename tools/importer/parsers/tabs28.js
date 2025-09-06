/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have at least one tab and panel
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // For tab content, use the panel's children (usually article)
    const content = document.createElement('div');
    Array.from(panel.children).forEach((child) => {
      content.appendChild(child.cloneNode(true));
    });

    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
