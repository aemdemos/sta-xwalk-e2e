/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Ensure tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row as specified
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Get tab label text
    const labelText = tabLabel.textContent.trim();

    // Get tab panel content
    const tabPanel = tabPanels[i];
    if (!tabPanel) return;

    // Only include the direct children of the tabPanel that have meaningful content
    const panelContent = [];
    Array.from(tabPanel.children).forEach(child => {
      if (child && (child.textContent.trim() || child.querySelector('img,ul,ol,h1,h2,h3,h4,h5,h6,p')) ) {
        panelContent.push(child);
      }
    });
    // If nothing found, fallback to tabPanel itself
    const contentCell = panelContent.length ? panelContent : [tabPanel];

    rows.push([labelText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
