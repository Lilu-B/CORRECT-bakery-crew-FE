import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosError } from 'axios';
import { useUser } from '../context/UserContext';
import type { User } from '../context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [loginInProgress, setLoginInProgress] = useState(false); // ⏳ статус входа
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInProgress) {
      console.warn('🔄 Login already in progress, please wait...');
      return; // предотвращаем повторный вход, если уже в процессе
    }
    setLoginInProgress(true); // устанавливаем статус входа в процессе

    // Проверяем, есть ли уже пользователь в контексте
    // Добавляем обработку ошибок с AxiosError
    try {
console.log('🔐 Login handler triggered');
      const res = await api.post('/login', { email, password });
console.log('✅ Login success, token:', res.data.token);

      sessionStorage.setItem('token', res.data.token); // токен сохранится в sessionStorage
      const profile = await api.get('/protected');   // interceptor добавит токен автоматически из sessionStorage в api/axios.ts
      const normalizedUser = profile.data;
      setUser(normalizedUser as User);  // сохраняем в глобальный контекст
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoginInProgress(false);
    }
  };

  // 👉 переход на главную после успешного входа
  useEffect(() => {
    if (user && user.isApproved && loginInProgress === false) {
      console.log('🎉 User profile:', user);
      navigate('/');
    }
  }, [user, loginInProgress, navigate]);

  return (
  <section aria-labelledby="login-heading">
    <h2 id="login-heading">Login</h2>
    <form onSubmit={handleLogin}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {errorMessage && (
        <p aria-live="assertive" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}
        </p>
      )}
      <button type="submit" aria-label="Login" disabled={loginInProgress}>
        {loginInProgress ? 'Logging in...' : 'Login'}
      </button>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  </section>
  );
};

export default Login;
