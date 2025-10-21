import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function TestApp() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Know Your Net Worth - Test</h1>
      <p>If you can see this, the deployment is working!</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
