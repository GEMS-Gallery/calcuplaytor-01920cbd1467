import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentInput = '';
let currentOperation = null;
let previousInput = null;

function updateDisplay() {
    display.value = currentInput;
}

function handleNumberClick(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperationClick(op) {
    if (currentInput !== '') {
        if (previousInput !== null) {
            calculate();
        }
        previousInput = parseFloat(currentInput);
        currentOperation = op;
        currentInput = '';
    }
}

async function calculate() {
    if (previousInput !== null && currentInput !== '' && currentOperation !== null) {
        const x = previousInput;
        const y = parseFloat(currentInput);
        let result;

        try {
            switch (currentOperation) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                    break;
            }

            currentInput = result.toString();
            previousInput = null;
            currentOperation = null;
            updateDisplay();
        } catch (error) {
            console.error('Calculation error:', error);
            currentInput = 'Error';
            updateDisplay();
        }
    }
}

document.querySelectorAll('.num').forEach(button => {
    button.addEventListener('click', () => handleNumberClick(button.textContent));
});

document.querySelectorAll('.op').forEach(button => {
    button.addEventListener('click', () => handleOperationClick(button.textContent));
});

document.getElementById('equals').addEventListener('click', calculate);

document.getElementById('clear').addEventListener('click', () => {
    currentInput = '0';
    previousInput = null;
    currentOperation = null;
    updateDisplay();
});

updateDisplay();
