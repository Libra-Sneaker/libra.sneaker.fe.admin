export const filterOptions = (input, option) => {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export const rowClassName = (record, index) => {
  return index % 2 === 0 ? "even-row" : "odd-row";
};

export const handleKeyPress = (event, customFunction) => {
  if (event.key === "Enter") {
    customFunction();
  }
};
