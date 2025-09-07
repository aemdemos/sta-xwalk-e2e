/* global WebImporter */
export default function parse(element, { document }) {
  // Only run if this is the tabs block root
  if (!element.classList.contains('cmp-tabs')) return;

  // Get tab labels
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    element.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs20)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if panel is missing
    if (!panel) continue;
    // For content, use all children of the tabpanel (not the tabpanel div itself)
    const contentNodes = Array.from(panel.children);
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      // If no children, fallback to textContent
      contentCell = panel.textContent.trim();
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  element.replaceWith(table);
}
