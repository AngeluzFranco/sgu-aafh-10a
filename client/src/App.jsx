import { useState } from 'react'
import Users from './modules/users/Users'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SGU - Sistema de Gestión de Usuarios</h1>
      </header>
      <main>
        <Users />
      </main>
    </div>
  )
}

export default App
