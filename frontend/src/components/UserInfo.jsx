import './UserInfo.css'

function UserInfo({ user, onLogout }) {
  return (
    <div className="user-info-container">
      <div className="user-info-card">
        <div className="user-header">
          <div className="user-avatar">
            {user.first_name?.[0] || user.username[0].toUpperCase()}
          </div>
          <h1>Welcome, {user.first_name || user.username}!</h1>
        </div>

        <div className="user-details">
          <h2>Your Information</h2>
          
          <div className="detail-item">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{user.username}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>

          {user.first_name && (
            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{user.first_name}</span>
            </div>
          )}

          {user.last_name && (
            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{user.last_name}</span>
            </div>
          )}
        </div>

        <button onClick={onLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserInfo

