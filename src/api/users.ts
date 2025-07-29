import api from './axios';
import type { User } from '../types/user';

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await api.get('/users'); 
  return res.data.users;
};