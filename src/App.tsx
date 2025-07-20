import { Routes, Route } from 'react-router-dom'; 
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventCreate from './pages/EventCreate';
import Donations from './pages/Donations';
import DonationDetails from './pages/DonationDetails';
import DonationCreate from './pages/DonationCreate';
// import Messages from './pages/Messages';

const App = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<EventCreate />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/donations/create" element={<DonationCreate />} />
          <Route path="/donations/:donationId" element={<DonationDetails />} />
      {/* <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} /> */}
        </Route>
      </Routes>
  );
};


export default App
