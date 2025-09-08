/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element;

  // Block header row as per guidelines
  const headerRow = ['Tabs (tabs26)'];

  // Extract tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Extract tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching labels and panels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // Reference the existing panel element for full HTML content
    tabRows.push([label, panel]);
  }

  // Compose table cells
  const cells = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  tabsRoot.replaceWith(block);
}
