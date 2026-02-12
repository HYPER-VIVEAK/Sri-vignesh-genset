// Format number according to Indian numbering system
// Examples: 1000 → 1,000 | 100000 → 1,00,000 | 1000000 → 10,00,000
export const formatIndianNumber = (num) => {
  if (num === undefined || num === null) return '0';
  
  const numStr = Math.floor(num).toString();
  const decimalPart = num.toFixed(2).split('.')[1];
  
  if (numStr.length <= 3) {
    return decimalPart && decimalPart !== '00' ? `${numStr}.${decimalPart}` : numStr;
  }
  
  let result = '';
  let count = 0;
  
  for (let i = numStr.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      result = ',' + result;
    }
    result = numStr[i] + result;
    count++;
  }
  
  if (decimalPart && decimalPart !== '00') {
    result += '.' + decimalPart;
  }
  
  return result;
};

// Format as Indian currency (with ₹ symbol)
export const formatIndianCurrency = (num) => {
  return `₹${formatIndianNumber(num)}`;
};
