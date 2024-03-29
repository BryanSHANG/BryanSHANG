// JavaScript source code
function checkPalindrome() {
            // Get the input element and result div
            var inputElement = document.getElementById('text-input');
            var resultDiv = document.getElementById('result');

            // Get the value from the input and remove non-alphanumeric characters
            var inputValue = inputElement.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            // Check if the input is empty
            if (inputValue === '') {
                alert('Please input a value');
                return;
            }

            // Check if the input is a palindrome
            var isPalindrome = true;
            for (var i = 0; i < inputValue.length / 2; i++) {
                if (inputValue[i] !== inputValue[inputValue.length - 1 - i]) {
                    isPalindrome = false;
                    break;
                }
            }

            // Display the result in the result div
            resultDiv.textContent = isPalindrome
                ? `${inputElement.value} is a palindrome`
                : `${inputElement.value} is not a palindrome`;
        }