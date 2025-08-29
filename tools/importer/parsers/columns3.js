/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns3)'];

  // The block structure is:
  // <div class="columns-wrapper">
  //   <div class="columns block columns-2-cols">
  //     <div> ... row group 1 ... </div>
  //     <div> ... row group 2 ... </div>
  //   </div>
  // </div>
  // Each row group contains the actual columns

  // Get all row groups (each direct child of `element`)
  const rowGroups = Array.from(element.querySelectorAll(':scope > div'));

  // For each row group, extract its columns (each direct child)
  const contentRows = rowGroups.map(rowGroup => {
    // Each column in a row is a direct child of the rowGroup; reference it directly
    return Array.from(rowGroup.children);
  });

  // Compose the table: header row, then one row for each group, each with its columns
  const cells = [headerRow, ...contentRows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
