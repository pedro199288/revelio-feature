function arrayFromString(classString: string) {
  return classString.split(' ').map((c) => c.trim());
}

function getNumberFromString(string: string) {
  return Number(string.replace(/[^0-9]/g, ''));
}

export { arrayFromString, getNumberFromString };
