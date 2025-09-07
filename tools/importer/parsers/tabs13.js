/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Block header row as per requirements
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // Get tab labels
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    element.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Extract the main content inside the tab panel
    // We'll use the innerHTML of the panel for full content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = panel.innerHTML;

    rows.push([
      label,
      contentDiv
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
