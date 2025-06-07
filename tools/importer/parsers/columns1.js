/* global WebImporter */
export default function parse(element, { document }) {
  // This function will combine all major nav sections into a single cell for the columns block table
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Collect the key nav sections (brand, sections, tools) in DOM order
  const brand = nav.querySelector('.nav-brand');
  const sections = nav.querySelector('.nav-sections');
  const tools = nav.querySelector('.nav-tools');

  // Prepare a single cell with all content in order
  const cellContent = [];
  if (brand) cellContent.push(brand);
  if (sections) cellContent.push(sections);
  if (tools) cellContent.push(tools);

  if (!cellContent.length) return;

  const headerRow = ['Columns (columns1)'];
  const dataRow = [cellContent]; // One column, all content in one cell
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    dataRow
  ], document);

  element.replaceWith(table);
}
