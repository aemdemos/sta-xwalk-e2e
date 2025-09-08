/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: each row is [label, content]
  const rows = tabLabels.map((label, i) => {
    // Defensive: get the panel
    const panel = tabPanels[i];
    // For content, reference the entire panel's content
    // Find the contentfragment/article inside
    const cf = panel.querySelector('.contentfragment, article') || panel;
    // Use the contentfragment/article as the cell, or fallback to panel
    return [label, cf];
  });

  // Table header
  const headerRow = ['Tabs (tabs21)'];

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
