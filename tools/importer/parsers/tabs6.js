/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Defensive: Get label text
    const labelText = labelEl.textContent.trim();

    // Defensive: Get corresponding panel
    const panelEl = tabPanels[i];
    if (!panelEl) return;

    // For tab content, grab all direct children of the panel
    // Usually a single .contentfragment, but could be more
    // We'll collect all direct children except empty grids
    const contentNodes = [];
    Array.from(panelEl.children).forEach(child => {
      // Skip empty grid wrappers
      if (child.classList.contains('aem-Grid') && child.children.length === 0) return;
      contentNodes.push(child);
    });
    // If nothing found, fallback to panelEl itself
    const tabContent = contentNodes.length > 0 ? contentNodes : [panelEl];

    rows.push([labelText, tabContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
