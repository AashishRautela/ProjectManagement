module.exports.generateRandomColorLight = () => {
  const colors = [
    '#F06D85',
    '#2EB6C9',
    '#F0C76D',
    '#20B486',
    '#0078D7',
    '#904EE2',
    '#45B6DA',
    '#602EC9',
    '#FF914D'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

module.exports.asyncHandler = () => {
  try {
  } catch (error) {}
};
