// Exact Decimal Math Engine to prevent floating-point rounding errors (0.1 + 0.2 = 0.3)
const CalculatorEngine = {
  add(a, b) {
    return Number((parseFloat(a) + parseFloat(b)).toFixed(10)).toString();
  },
  subtract(a, b) {
    return Number((parseFloat(a) - parseFloat(b)).toFixed(10)).toString();
  },
  multiply(a, b) {
    return Number((parseFloat(a) * parseFloat(b)).toFixed(10)).toString();
  },
  divide(a, b) {
    if (parseFloat(b) === 0) return "Can't divide by zero";
    return Number((parseFloat(a) / parseFloat(b)).toFixed(10)).toString();
  },
  square(a) {
    return Number((parseFloat(a) ** 2).toFixed(10)).toString();
  },
  sqrt(a) {
    if (parseFloat(a) < 0) return "Invalid input";
    return Number(Math.sqrt(parseFloat(a)).toFixed(10)).toString();
  },
  inverse(a) {
    if (parseFloat(a) === 0) return "Can't divide by zero";
    return Number((1 / parseFloat(a)).toFixed(10)).toString();
  }
};