import React, { createContext, useContext, useState } from 'react';
import { groups as initialGroups } from '../data/groups';

const GroupsContext = createContext(null);

const GROUP_COLORS = ['#3D5AFE', '#7B61FF', '#1F9D63', '#E0523F', '#FF7A59', '#0891B2', '#C2185B', '#F59E0B', '#1F6F6B'];

function makeInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState(initialGroups);

  const createGroup = ({ name, description = '', memberIds = [], color }) => {
    const newGroup = {
      id: `g${Date.now()}`,
      name,
      description,
      memberIds,
      createdBy: 'u2',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      messages: 0,
      color: color || GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)],
      initials: makeInitials(name),
      permissions: { whoCanAddMembers: 'Admins only', whoCanSendMessages: 'Everyone', whoCanShareFiles: 'Everyone' },
    };
    setGroups((prev) => [newGroup, ...prev]);
    return newGroup;
  };

  const updateGroup = (id, patch) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, ...patch, initials: patch.name ? makeInitials(patch.name) : g.initials }
          : g
      )
    );
  };

  const deleteGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const addMember = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId && !g.memberIds.includes(userId)
          ? { ...g, memberIds: [...g.memberIds, userId] }
          : g
      )
    );
  };

  const removeMember = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberIds: g.memberIds.filter((id) => id !== userId) } : g
      )
    );
  };

  const findGroup = (id) => groups.find((g) => g.id === id);

  return (
    <GroupsContext.Provider value={{ groups, createGroup, updateGroup, deleteGroup, addMember, removeMember, findGroup, GROUP_COLORS }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupsContext);
}
