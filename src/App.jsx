import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'


import LoginScreen from '../components/LoginScreen'
import Dashboard from '../components/Dashboard'
import SignupScreen from '../components/SignupScreen'
import ArtTypeScreen from '../components/ArtTypeScreen'
import ArtsList from '../components/ArtsList'

function App() {
 

  return (
    <AuthProvider>
         <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route 
                path='/login'
                element={
                    <PublicRoute>
                      <LoginScreen />
                    </PublicRoute>
               
              }
              />

              <Route
              path='/signup'
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
              />

              <Route
                path='/art-type'
                element={
                  <ProtectedRoute>
                    <ArtTypeScreen />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/art'
                element={
                  <ProtectedRoute>
                    <ArtsList />
                  </ProtectedRoute>
                }
              />




              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                
              }
              />

            </Routes>
          </div>
          </Router>
    </AuthProvider>
  )
}

export default App
