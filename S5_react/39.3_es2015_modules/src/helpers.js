const choice = (items) => {
  const idx = Math.floor(Math.random() * items.length);
  return items[idx];
};

const remove = (array, item) => {
  const idx = array.findIndex((val) => val === item);
  if (idx === -1) return undefined;
  return array.splice(idx, 1)[0];
};

export { choice, remove };
