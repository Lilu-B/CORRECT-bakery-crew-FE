import { useState, useRef, useEffect } from 'react';
import '../styles/main.css'; 

const WelcomeNotice = () => {
  const [showInfo, setShowInfo] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!showInfo) return;

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowInfo(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInfo]);

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2>👋 Welcome to Bakery Crew Hub</h2>
        <p>
          This is a <strong>DEMO VERSION</strong> of the platform for managing shifts,
          events, and team collaboration.<br />
          You can log in using one of the test accounts below or register a new one.
        </p>
        <p style={{ marginBottom: '1rem' }}><strong>New accounts must be approved by your shift manager!</strong></p>
        <p>👇</p>
        <button className="button-info" onClick={() => setShowInfo(true)} style={{ marginTop: '1rem' }}>
        About this app
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ marginTop: '1rem', marginBottom: '2rem' }}>

            <p><strong>👨‍🍳 Admin</strong> — <code>admin@example.com</code> / <code>password123</code></p>
            <p><strong>👩‍👦‍👦 Manager 1st shift</strong> — <code>manager1@example.com</code> / <code>user123</code></p>
            <p><strong>👩‍👦‍👦 Manager 2nd shift</strong> — <code>manager2@example.com</code> / <code>user123</code></p>
            <p><strong>👤 User-1 1st shift</strong> — <code>user1@example.com</code> / <code>user123</code></p>
            <p><strong>👤 User-2 2nd shift</strong> — <code>user2@example.com</code> / <code>user123</code></p>

        </div>

      </div>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h3>📌 About Bakery Crew Hub</h3>
            <p>
                <strong>Bakery Crew Hub</strong> is a simple and friendly tool for bakery teams to:
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem', marginBottom: '1rem' }}>
                <li>📅 View their shift schedule</li>
                <li>✋ Apply for overtime work</li>
                <li>🎁 Join team donation campaigns</li>
                <li>💬 Communication via messages</li>
                <li>🗓️ Keep track of upcoming events on the calendar</li>
            </ul>
            <p>
                This is a <strong>demo version</strong> of the platform. You can log in with a test account or register a new one.
            </p>
            <p><strong>New users must be approved by their shift manager!</strong></p>

            <hr style={{ margin: '1rem 0' }} />

            <p><strong>👤 User</strong> <em>(a regular team member)</em></p>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                <li>Sees overtime and donations for their shift only</li>
                <li>Can apply to events and donate</li>
                <li>Can add applied overtime to their Google Calendar</li>
                <li>Can message their manager</li>
                <li>❌ Cannot create events or manage other users</li>
            </ul>

            <p style={{ marginTop: '1rem' }}><strong>👩‍👦‍👦 Manager</strong> <em>(leads a shift team)</em></p>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                <li>Can approve new users in their shift</li>
                <li>Can create/delete overtime and donations for their shift</li>
                <li>Can message users in their shift and admin</li>
                <li>❌ Cannot change roles or manage other shifts</li>
            </ul>

            <p style={{ marginTop: '1rem' }}><strong>👨‍🍳 Admin</strong> <em>(Bakery Crew Administrator)</em></p>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                <li>Has full access</li>
                {/* <li>Can delete any user</li> */}
                {/* <li>Can promote/demote managers</li> */}
                <li>Can manage all overtime and donations</li>
                <li>Can message to everyone</li>
            </ul>

            <p style={{ marginTop: '1rem' }}><em>
              Test users are pre-created for demonstration. <br />Registered users require approval before access.
            </em></p>
            <p style={{ marginTop: '1rem' }}><strong>🔗 Explore more:</strong></p>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
            <li>
                <a href="https://www.linkedin.com/in/liliiabahirova" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: '16px', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                My LinkedIn profile
                </a>
            </li>
            <li>
                <a href="https://github.com/Lilu-B/CORRECT-bakery-crew-FE" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{ width: '16px', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                GitHub – Frontend (React + TypeScript)
                </a>
            </li>
            <li>
                <a href="https://github.com/Lilu-B/CORRECT-bakery-crew-BE" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{ width: '16px', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                GitHub – Backend (Node.js + PostgreSQL)
                </a>
            </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeNotice;