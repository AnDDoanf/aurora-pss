export const EMPTY_LAYOUT_URL = 'https://pixel-prestige.com/ship-builder.php?ship=386&rooms=';
const LINE_BUILD_ROOT_IDS = new Set([3, 103, 247]);

export const isLineBuildDesign = (design) => LINE_BUILD_ROOT_IDS.has(Number(design?.rootId || design?.id));

export const pointerIsInside = (clientX, clientY, rect) => Boolean(rect
  && clientX >= rect.left && clientX <= rect.right
  && clientY >= rect.top && clientY <= rect.bottom);

export const normalizedRect = (startX, startY, endX, endY) => ({
  left: Math.min(startX, endX),
  top: Math.min(startY, endY),
  width: Math.abs(endX - startX),
  height: Math.abs(endY - startY)
});

export const gridLine = (start, end) => {
  const cells = [];
  let column = Number(start.column);
  let row = Number(start.row);
  const targetColumn = Number(end.column);
  const targetRow = Number(end.row);
  const columnStep = column < targetColumn ? 1 : -1;
  const rowStep = row < targetRow ? 1 : -1;
  const columnDistance = Math.abs(targetColumn - column);
  const rowDistance = Math.abs(targetRow - row);
  let error = columnDistance - rowDistance;

  while (true) {
    cells.push({ column, row });
    if (column === targetColumn && row === targetRow) break;
    const doubledError = error * 2;
    if (doubledError > -rowDistance) {
      error -= rowDistance;
      column += columnStep;
    }
    if (doubledError < columnDistance) {
      error += columnDistance;
      row += rowStep;
    }
  }
  return cells;
};

export const copyText = async (value) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

