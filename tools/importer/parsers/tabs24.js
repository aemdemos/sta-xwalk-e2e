/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs container (should be the element itself)
  const tabsRoot = element;
  if (!tabsRoot) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Map tab labels to their corresponding panels by aria-controls/id
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const tabLabel = labelEl.textContent.trim();
    const ariaControls = labelEl.getAttribute('aria-controls');
    // Find the panel with matching id
    const panelEl = tabPanels.find(p => p.id === ariaControls);
    if (!panelEl) continue;

    // Defensive: get the main content of the tab panel
    // Usually, the content is the first child div (e.g., .contentfragment)
    // We'll grab all children of the tabpanel (excluding script/style)
    const contentNodes = Array.from(panelEl.childNodes).filter(
      node => !(node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE'))
    );
    // If only one element, use it directly, else wrap in a fragment
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else {
      // Create a fragment to hold multiple nodes
      const frag = document.createDocumentFragment();
      contentNodes.forEach(n => frag.appendChild(n.cloneNode(true)));
      tabContent = frag;
    }
    rows.push([tabLabel, tabContent]);
  }

  // Build the table
  const headerRow = ['Tabs (tabs24)'];
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
