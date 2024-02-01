function arrayFromClassesString(classString: string) {
  return classString
    .split(' ')
    .map((c) => c.trim())
    .filter(Boolean);
}

function getNumberFromString(string: string) {
  return Number(string.replace(/[^0-9]/g, ''));
}

function getBgAlphaFromElement(element: Element) {
  const backgroundColor = window.getComputedStyle(element).backgroundColor;
  if (backgroundColor.startsWith('rgba')) {
    return parseFloat(
      backgroundColor.slice(backgroundColor.lastIndexOf(',') + 1, -1),
    );
  } else if (backgroundColor.startsWith('rgb')) {
    return 1;
  } else {
    console.warn('Unsupported color format:', backgroundColor);
    return undefined;
  }
}

export { arrayFromClassesString, getNumberFromString, getBgAlphaFromElement };
