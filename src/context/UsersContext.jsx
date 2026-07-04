import React, { createContext, useContext, useState } from 'react';
import { users as initialUsers } from '../data/users';

const UsersContext = createContext(null);

const AVATAR_COLORS = ['#E0523F', '#3D5AFE', '#FF7A59', '#7B61FF', '#34A876', '#C2185B', '#0891B2', '#F59E0B', '#1F6F6B'];

function makeInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);

  const inviteUser = ({ name, email, role = 'Member' }) => {
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role,
      status: 'invited',
      lastActive: '—',
      joined: 'Pending',
      initials: makeInitials(name),
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const findUser = (id) => users.find((u) => u.id === id);

  return (
    <UsersContext.Provider value={{ users, inviteUser, updateUser, findUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
