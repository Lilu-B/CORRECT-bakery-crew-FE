import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createEvent } from '../api/events';
import type { AxiosError } from 'axios';

const EventCreate = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState(user?.shift || '1st');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!user || (user.role !== 'manager' && user.role !== 'developer')) {
    return <p>You do not have access to create events.</p>;
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) {
    return setError('Title is required');
  }
  if (!date) {
    return setError('Date is required');
  }
  if (!shift) {
    return setError('Shift is required');
  }
  if (description && description.length > 500) {
    return setError('Description cannot exceed 500 characters');
  }

  const formattedDate = date;

  try {
    await createEvent({
      title,
      description,
      date: formattedDate,
      shift,
    });

    setError(null);
    setTitle('');
    setDate('');
    setShift(user.shift || '1st');
    setDescription('');

    navigate('/events');
  } catch (err) {
    const error = err as AxiosError<{ msg?: string }>;
    setError(error.response?.data?.msg || 'Failed to create event');
  }
};

  return (
    <div className="main-content">
      <section>
        <h2>Create a New Overtime</h2>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <div>
          <label htmlFor="event-title">
              <h3>New Title</h3>
          </label>
          <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
        <label>
            Date:{' '}
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            />
        </label>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="event-shift">
            <h3>Shift:</h3>
          </label>

          {user.role === 'developer' ? (
            <select
              id="event-shift"
              value={shift}
              onChange={(e) => setShift(e.target.value as '1st' | '2nd' | 'night')}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                padding: '10px',
                borderRadius: '4px',
                border: 'none',
                width: '100%',
              }}
            >
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="night">night</option>
            </select>
          ) : (
            <input
              id="event-shift"
              type="text"
              value={user.shift}
              disabled
              readOnly
              style={{
                backgroundColor: '#333',
                color: '#fff',
                padding: '10px',
                borderRadius: '4px',
                border: 'none',
                width: '100%',
              }}
            />
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%' }}
          ></textarea>
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
        )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit" className="button-green" aria-label="Submit donation">
              Create
            </button>
            <button type="button" className="button-red" onClick={() => navigate('/events')} aria-label="Cancel event creation">
              Cancel
            </button>
          </div>
      </form>
      </section>
    </div>
  )};

export default EventCreate;
