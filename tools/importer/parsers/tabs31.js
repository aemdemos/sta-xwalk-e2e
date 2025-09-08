/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the root tabs block
  if (!element.classList.contains('cmp-tabs')) return;

  // Header row for block table
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // Get tab labels and tab panels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Get all content inside the tab panel (excluding empty grids)
    // We'll use the first .contentfragment or fallback to the panel
    let content = panel.querySelector('.contentfragment') || panel;

    // Clone to avoid moving nodes out of the DOM
    content = content.cloneNode(true);

    // Remove empty grid divs
    content.querySelectorAll('.aem-Grid').forEach(g => {
      if (!g.textContent.trim()) g.remove();
    });

    // Wrap content in a div to ensure it's a single element
    const cellDiv = document.createElement('div');
    cellDiv.appendChild(content);

    rows.push([label, cellDiv]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  element.replaceWith(block);
}
