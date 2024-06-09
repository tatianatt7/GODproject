import axios from 'axios';
import { User } from '../types/Users';

const URL = 'https://randomuser.me/api/?results=10'

const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ results: User[] }>(URL);
    return response.data.results;
  } catch (error) {
    throw new Error('Не удалось загрузить пользователей');
  }
};

export { fetchUsers };
