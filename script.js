let currentInput = "";
let expression = [];
let shouldResetDisplay = false;

const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".clss");

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  const key = e.key;
  if (/[0-9]/.test(key)) {
    handleNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculateResult();
  } else if (key === "Escape") {
    clearCalculator();
  }
}

function handleButtonClick(e) {
  const value = e.target.textContent;

  if (value === "C") {
    clearCalculator();
  } else if (value === "=") {
    calculateResult();
  } else if (["+", "-", "*", "/"].includes(value)) {
    handleOperator(value);
  } else {
    handleNumber(value);
  }
}

function handleNumber(num) {
  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  if (num === "0" && currentInput === "0") return;

  if (currentInput.length >= 12) return;

  currentInput += num;
  updateDisplay();
}

function handleOperator(operator) {
  if (currentInput === "" && expression.length === 0) {
    if (operator === "-") {
      currentInput = "-";
      updateDisplay();
    }
    return;
  }

  if (currentInput !== "") {
    expression.push(currentInput);
  }

  if (["+", "-", "*", "/"].includes(expression[expression.length - 1])) {
    expression.pop();
  }

  expression.push(operator);
  shouldResetDisplay = true;
  currentInput = "";
  updateDisplay();
}

function calculateResult() {
  if (currentInput !== "") {
    expression.push(currentInput);
  }

  if (["+", "-", "*", "/"].includes(expression[expression.length - 1])) {
    expression.pop();
  }

  if (expression.length === 0) return;

  try {
    let tempExpression = [...expression];
    for (let i = 1; i < tempExpression.length - 1; i += 2) {
      if (tempExpression[i] === "*" || tempExpression[i] === "/") {
        const num1 = parseFloat(tempExpression[i - 1]);
        const num2 = parseFloat(tempExpression[i + 1]);
        let result;

        if (tempExpression[i] === "*") {
          result = num1 * num2;
        } else {
          if (num2 === 0) throw new Error("Division by zero");
          result = num1 / num2;
        }

        tempExpression.splice(i - 1, 3, result.toString());
        i -= 2;
      }
    }

    let result = parseFloat(tempExpression[0]);
    for (let i = 1; i < tempExpression.length; i += 2) {
      const num = parseFloat(tempExpression[i + 1]);
      if (tempExpression[i] === "+") {
        result += num;
      } else if (tempExpression[i] === "-") {
        result -= num;
      }
    }

    result = formatResult(result);

    currentInput = result.toString();
    expression = [];
    updateDisplay();
  } catch (error) {
    currentInput = "Error";
    expression = [];
    updateDisplay();
    setTimeout(clearCalculator, 1500);
  }
}

function formatResult(number) {
  if (isNaN(number) || !isFinite(number)) {
    throw new Error("Invalid calculation");
  }

  let result = number.toPrecision(12);

  result = parseFloat(result);

  return result.toString();
}

function clearCalculator() {
  currentInput = "";
  expression = [];
  updateDisplay();
}

function updateDisplay() {
  let displayText = expression.join(" ");
  if (currentInput !== "") {
    if (displayText !== "") {
      displayText += " " + currentInput;
    } else {
      displayText = currentInput;
    }
  }
  display.textContent = displayText || "0";
}

updateDisplay();
