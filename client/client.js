// Example frontend code to create and send a C file
const userInput = `
#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`;

// Create a Blob from the user input
const file = new Blob([userInput], { type: 'text/plain' });

// Create a FormData object to send the file
const formData = new FormData();
formData.append('file', file, 'code.c');

// Send the file to the backend
fetch('http://localhost:3000/compile/c', {
  method: 'POST',
  body: formData, // Send the formData containing the file
})
  .then((response) => response.text())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
