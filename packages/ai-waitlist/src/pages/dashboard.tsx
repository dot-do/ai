import React from 'react'
import { withAuth, User } from '../lib/auth/auth-client'

interface DashboardProps {
  user: User
}

const Dashboard = ({ user }: DashboardProps) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>

      <div className="user-info">
        <h2>User Information</h2>
        <p>Name: {user.name || 'Not provided'}</p>
        <p>Email: {user.email || 'Not provided'}</p>
      </div>

      <div className="waitlist-status">
        <h2>Waitlist Status</h2>
        <div className="status-card">
          <div className="status-icon">✓</div>
          <div className="status-content">
            <h3>Application Received</h3>
            <p>Thank you for completing the onboarding process. Your application has been received and is being reviewed.</p>
          </div>
        </div>
      </div>

      <div className="next-steps">
        <h2>Next Steps</h2>
        <ul>
          <li>We'll review your application and get back to you soon</li>
          <li>You'll receive an email notification when your access is granted</li>
          <li>In the meantime, you can explore our documentation</li>
        </ul>
      </div>

      <div className="actions">
        <a href="/" className="btn-primary">
          Return to Home
        </a>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)
