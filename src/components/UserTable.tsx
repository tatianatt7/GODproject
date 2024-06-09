
import React, { useCallback, useEffect, useState } from 'react';
import { fetchUsers } from '../api/api';
import { User } from '../types/Users';

const DEBOUNCE = 1000

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const users = await fetchUsers()
        setUsers(users)
        setFilteredUsers(users)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setIsLoading(false)
      }
    })()
  }, []);

  const debounce = <F extends (...args: any[]) => void>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<F>) => {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  };


  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;  // Скопировать значение из события
    setSearchText(value);
    debounce(() => {
      const filtered = users.filter(user =>
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, DEBOUNCE)();
  }, [users]);  // зависимость от users


  const handleReset = useCallback(() => {
    setSearchText('');
    setFilteredUsers(users);
  }, [users]);


  return (
    <div>
      <br />
      <div>
        <input type="text" value={searchText} onChange={handleSearch} placeholder="Search by name" />
        <button onClick={handleReset}>Сбросить</button>
      </div>
      {isLoading && <p>Загрузка...</p>}
      {error && <div>Ошибка: {error}</div>}
      <br />
      <center>
        {filteredUsers.length ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Picture</th>
                <th>Location</th>
                <th>Email</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{`${user.name.first} ${user.name.last}`}</td>
                  <td>
                    <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} />
                  </td>
                  <td>{`${user.location.state}, ${user.location.city}`}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.registered.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
        <p>
          { !isLoading && "Ничего не найдено" }
          </p>
        )}
      </center>
    </div>
  );
};

export default UserTable;
