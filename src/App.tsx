import './App.css'
import { Route, Routes } from 'react-router'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import TravelPlanList from './components/TravelPlanner/TravelPlanList'
import TravelPlanGenerator from './components/TravelPlanner/TravelPlanGenerator'
import UsersList from './components/UsersList'

function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/travel-plans" element={<ProtectedRoute><TravelPlanList /></ProtectedRoute>} />
        <Route path="/travel-plans/create" element={<ProtectedRoute><TravelPlanGenerator /></ProtectedRoute>} />
        <Route path="/travel-plans/edit/:id" element={<ProtectedRoute><TravelPlanGenerator /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
      </Routes>

      <Notifications />
    </MantineProvider>
  )
}

export default App
