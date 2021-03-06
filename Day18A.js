const { getInput } = require('./utils');

const day18A = async () => {
  let input = await getInput('18', '\n');
  input = input.map((x) => x.split('').filter((x) => x !== ' '));
  const solutions = input.map((i) => evaluate(i, 0));
  return solutions.reduce((acc, s) => acc + s, 0);
};

const evaluate = (expression, startIndex) => {
  let nextIndex = startIndex;
  let currentSolution;
  let numberStack = [];
  let operatorStack = [];
  while (nextIndex < expression.length) {
    let currentChar = expression[nextIndex];
    if (/[0-9]+/g.test(currentChar)) {
      // if second number in a expression, do operation
      if (operatorStack.length) {
        currentSolution =
          operatorStack.pop() === '*'
            ? numberStack.pop() * Number(currentChar)
            : numberStack.pop() + Number(currentChar);
        numberStack.push(currentSolution);
      } else {
        numberStack.push(Number(currentChar));
      }
      nextIndex++;
    } else if (currentChar === '*' || currentChar === '+') {
      operatorStack.push(currentChar);
      nextIndex++;
    } else if (currentChar === '(') {
      // Evaluate the expression surrounded by parenthesis
      [currentSolution, nextIndex] = evaluate(expression, nextIndex + 1);
      // Apply the last operation in stack to the return value of the evaluation
      // if there is one
      if (operatorStack.length) {
        currentSolution =
          operatorStack.pop() === '*'
            ? numberStack.pop() * Number(currentSolution)
            : numberStack.pop() + Number(currentSolution);
        numberStack.push(currentSolution);
      } else {
        numberStack.push(currentSolution);
      }
    } else {
      // case when char is ')'
      // increment and leave the loop to return to the calling function
      nextIndex++;
      break;
    }
  }
  // if startIndex is zero, this is main func call
  // if not, it's evaluation of a sub expression, so return nextIndex as well
  return startIndex ? [currentSolution, nextIndex] : currentSolution;
};

module.exports = day18A;
