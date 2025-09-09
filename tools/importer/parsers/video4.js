/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Video (video4)'];

  // Try to find a video or iframe (YouTube, Vimeo, etc.)
  const video = element.querySelector('video');
  const iframe = element.querySelector('iframe');
  let videoSrc = null;
  let posterImg = null;

  if (video) {
    videoSrc = video.src || (video.querySelector('source') && video.querySelector('source').src);
    if (video.poster) {
      posterImg = document.createElement('img');
      posterImg.src = video.poster;
      posterImg.alt = video.getAttribute('alt') || '';
    }
  } else if (iframe) {
    videoSrc = iframe.src;
    // Try to find a poster image
    const img = element.querySelector('img');
    if (img) {
      posterImg = img;
    } else {
      const picture = element.querySelector('picture');
      if (picture) {
        const picImg = picture.querySelector('img');
        if (picImg) posterImg = picImg;
      }
    }
  } else {
    // No video or iframe found: still replace the element with an empty Video block (to ensure DOM is modified)
    const rows = [headerRow, ['']];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
    return;
  }

  // Compose the cell content: poster image (if any), then video link
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoSrc) {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.textContent = videoSrc;
    cellContent.push(link);
  }

  const rows = [
    headerRow,
    [cellContent.length ? cellContent : ['']]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
