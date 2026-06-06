import React from 'react';
import { User, Lightbulb, Search } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Role, ROLE_INFO } from '../types';

const roleIcons: Record<Role, React.ReactNode> = {
  player: <User size={20} />,
  hint: <Lightbulb size={20} />,
  reviewer: <Search size={20} />,
};

const roleColors: Record<Role, { active: string; hover: string }> = {
  player: {
    active: 'bg-blue-600 text-white border-blue-500',
    hover: 'hover:bg-blue-600/20 hover:border-blue-500/50',
  },
  hint: {
    active: 'bg-amber-600 text-white border-amber-500',
    hover: 'hover:bg-amber-600/20 hover:border-amber-500/50',
  },
  reviewer: {
    active: 'bg-emerald-600 text-white border-emerald-500',
    hover: 'hover:bg-emerald-600/20 hover:border-emerald-500/50',
  },
};

export const RolePanel: React.FC = () => {
  const { currentRole, setCurrentRole } = useGameStore();
  const roles: Role[] = ['player', 'hint', 'reviewer'];

  return (
    <div className="p-4 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 mb-3">操作角色</h3>
      <div className="flex gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setCurrentRole(role)}
            className={`
              flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-200
              ${currentRole === role
                ? roleColors[role].active
                : `border-slate-600 text-slate-400 ${roleColors[role].hover}`
              }
            `}
          >
            {roleIcons[role]}
            <span className="text-sm font-medium">{ROLE_INFO[role].name}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 text-center">
        {ROLE_INFO[currentRole].description}
      </p>
    </div>
  );
};
