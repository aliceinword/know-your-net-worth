import React, { useState } from 'react';

function App_Test() {
  const [test, setTest] = useState('Hello World');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Test App</h1>
      <p>{test}</p>
      <button onClick={() => setTest('Button clicked!')}>Click me</button>
    </div>
  );
}

export default App_Test;
