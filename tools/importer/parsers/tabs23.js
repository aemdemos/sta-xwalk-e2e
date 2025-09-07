/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: block name as required
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    // Remove aria attributes for import cleanliness
    panel.removeAttribute('aria-labelledby');
    panel.removeAttribute('aria-hidden');
    panel.removeAttribute('tabindex');
    // Add row: [label, panel]
    rows.push([label, panel]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
