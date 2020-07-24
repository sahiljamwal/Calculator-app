window.addEventListener("load", bindFunctions);

//global variables for dom manipulation
var result = document.querySelector("#final_output");
var operator = document.querySelectorAll(".operator");
var operand = document.querySelectorAll(".operand");
var current = "";
var operandStr = "";

//binding each button click to it's coresponding function
function bindFunctions() {
    operator.forEach(operator => operator.addEventListener('click', operatorClicked));
    operand.forEach(operand => operand.addEventListener('click', operandClicked));
    document.querySelector("#delete").addEventListener('click', deleteLastChar);
    document.querySelector("#clearAll").addEventListener('click', clearAll);
    document.querySelector("#equals").addEventListener('click', evaluate);
}

//whenever any operand is clicked
function operandClicked() {
    if (result.value.length >= 1 && this.innerText == '.') {
        if (result.value.charAt(result.value.length - 1) != '.') {
            result.value += this.innerText;
            operandStr += this.innerText;
        }
    } else {
        result.value += this.innerText;
        operandStr += this.innerText;
    }
    //console.log(operandStr)
    current = operandStr;
}

//whenever any operator  is clicked
function operatorClicked() {
    if (result.value >= 1) {

        if (!isOperand(result.value.charAt(result.value.length - 1))) {
            //if last entered char was an operator
            if (result.value.length > 1) {
                result.value = result.value.substring(0, result.value.length - 1) + this.innerText;
                operatorStack.pop();
            }
        } else {
            result.value += this.innerText;
            if (operandStr.length > 0) {
                addToOperandList(operandStr);
            }
        }
        checkPriority(this.innerText);
        addToOperatorList(this.innerText);
    }
}

//to clear the last char from stack and output
function deleteLastChar() {
    if (result.value.length > 1) {
        var currentElement = result.value.charAt(result.value.length - 1);
        result.value = result.value.substring(0, result.value.length - 1);
        if (isOperand(currentElement)) {
            if (onTop(operandStack) === current) {
                operandStr = operandStack.pop();
                strOperand = operandStr.substring(0, operandStr.length - 1);
                current = operandStr;
                if (operandStr.length >= 1) {
                    operandStack.push(operandStr);
                }
            } else {
                operandStr = operandStr.substring(0, operandStr.length - 1);
                current = operandStr;
                if (operandStr.length >= 1) {
                    operandStack.push(operandStr);
                }
            }
        } else {
            operatorStack.pop();
        }
    } else {
        clearAll();
    }
}

//to clear the stacks and strings o/p
function clearAll() {
    result.value = '';
    current = "";
    operandStr = "";
    operandStack = [];
    operatorStack = [];
}

//evaluate the stacks 
function evaluate() {
    if (operatorStack.length >= 1) {
        operandStack.push(operandStr);
        while (operatorStack.length != 0) {
            let operand1 = parseFloat(operandStack.pop());
            let operand2 = parseFloat(operandStack.pop());
            let operator = operatorStack.pop();
            computeResult(operand1, operand2, operator);
        }
    }
    result.value = onTop(operandStack);
    operandStr = result.value;
}

//to check if top of operandStack is operand
function isOperand(current) {
    return Number.isInteger(parseInt(current));
}

//Evaluation Logic using Stack
var operatorStack = [];
var operandStack = [];
var priorityTable = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
};



//to add  operator to the operatorStack
function addToOperatorList(currentOperator) {
    operatorStack.push(currentOperator);
    operandStr = '';
}

//to add operand to the operandStack
function addToOperandList(currentOperand) {
    operandStack.push(currentOperand);
}

//to check priority of a operator at top of stacks
function checkPriority(operator) {
    while (operatorStack.length != 0 && priorityTable[onTop(operandStack)] > priorityTable[operator]) {
        let operand1 = parseFloat(operandStack.pop());
        let operand2 = parseFloat(operandStack.pop());
        let operator = operatorStack.pop();
        computeResult(operand1, operand2, operator);
    }
}

//to check the peek element of a stack
function onTop(arr) {
    return arr[arr.length - 1];
}

//helper function to evaluate the result
function computeResult(operand1, operand2, operator) {
    if (operator == '+') {
        operandStack.push(operand2 + operand1);
    } else if (operator == '-') {
        operandStack.push(operand2 - operand1);
    } else if (operator == '*') {
        operandStack.push(operand2 * operand1);
    } else if (operator == '%') {
        operandStack.push(operand2 % operand1);
    } else if (operator == '/') {
        operandStack.push(operand2 / operand1);
    }
}