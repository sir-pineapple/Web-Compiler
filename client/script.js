document.getElementById('compileBtn').addEventListener('click', function() {
  const userInput = document.getElementById('codeInput').value;
  const language = document.getElementById('languageSelect').value;
  const fileInput = document.getElementById('fileInput').files[0];

  const formData = new FormData();
  if (fileInput) {
    formData.append('file', fileInput);
  } else {
    const file = new Blob([userInput], { type: 'text/plain' });
    formData.append('file', file, `code.${language}`);
  }

  let endpoint = '';
  switch (language) {
    case 'c':
      endpoint = '/compile/c';
      break;
    case 'cpp':
      endpoint = '/compile/cpp';
      break;
    case 'java':
      endpoint = '/compile/java';
      break;
    case 'python':
      endpoint = '/compile/python';
      break;
    default:
      endpoint = '/compile/c';
  }

  fetch(`http://localhost:3000${endpoint}`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('output').textContent = data;
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('output').textContent = "An error occurred while compiling.";
    });
});
