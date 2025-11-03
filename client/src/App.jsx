import { useState } from 'react'
import Users from './modules/users/Users'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>SGU - Sistema de Gestión de Usuarios</h1>
          <p className="subtitle">Administra usuarios de forma moderna y eficiente</p>
        </div>
      </header>
      <main>
        <div className="container">
          <Users />
        </div>
      </main>
    </div>
  )
}

export default App
