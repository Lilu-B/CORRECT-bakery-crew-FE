import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosError } from 'axios';


const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shift: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      setMessage({ type: 'success', text: '✅ Registered! Please wait for approval.' });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 409) {
        setMessage({ type: 'error', text: '❌ A user with this email already exists. Please try a different one.' });
      } else {
        const errorMsg = error.response?.data?.message || '❌ Registration failed. Please try again.';
        setMessage({ type: 'error', text: errorMsg });
      }
    }
  };


return (
  <div className="main-content">
    <section className="card" aria-labelledby="register-heading">
      <h2 id="register-heading">Register</h2>

      {message && (
        <p
          className={message.type === 'error' ? 'error-message' : 'success-message'}
          aria-live={message.type === 'error' ? 'assertive' : 'polite'}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleRegister} style={{ marginTop: '1rem' }}>
        <label htmlFor="register-name">
          <h3>Name:</h3>
          <input
            id="register-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-email">
          <h3>Email:</h3>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-password">
          <h3>Password:</h3>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-phone">
          <h3>Phone:</h3>
          <input
            id="register-phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <label htmlFor="register-shift" style={{
            fontWeight: 'bold',
            minWidth: '60px',
            marginBottom: 0,
          }}>Shift:</label>
          <select
            id="register-shift"
            name="shift"
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: e.target.value })}
            required
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
            }}
          >
            <option value="">-- Select your shift --</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            {/* <option value="night">Night</option> */}
          </select>
        </div>

        <button
          type="submit"
          aria-label="Register"
          className="button-green"
          style={{ marginTop: '3rem' }}
        >
          Register
        </button>

        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  </div>
);
};

export default Register;