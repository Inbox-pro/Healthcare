import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/hms';
import { DEMO_USERS } from '../data/mockData';

export interface RolePermission {
  canViewDashboard: boolean;
  allowedModules: string[];
  canManageUsers: boolean;
  canEditClinicalNotes: boolean;
  canPrescribeMeds: boolean;
  canDispensePharmacy: boolean;
  canVerifyLab: boolean;
  canManageBilling: boolean;
  canManageBeds: boolean;
  canEditSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  super_admin: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'patients', 'doctors', 'appointments', 'opd', 'ipd', 'emergency', 'beds', 'nursing', 'consultation', 'prescriptions', 'pharmacy', 'inventory', 'laboratory', 'radiology', 'records', 'billing', 'insurance', 'finance', 'staff', 'bloodbank', 'ambulance', 'ot', 'discharge', 'documents', 'reports', 'audit', 'settings', 'patient-portal'],
    canManageUsers: true,
    canEditClinicalNotes: true,
    canPrescribeMeds: true,
    canDispensePharmacy: true,
    canVerifyLab: true,
    canManageBilling: true,
    canManageBeds: true,
    canEditSettings: true,
  },
  hospital_admin: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'patients', 'doctors', 'appointments', 'opd', 'ipd', 'emergency', 'beds', 'nursing', 'prescriptions', 'pharmacy', 'inventory', 'laboratory', 'radiology', 'records', 'billing', 'insurance', 'finance', 'staff', 'bloodbank', 'ambulance', 'ot', 'discharge', 'documents', 'reports', 'audit'],
    canManageUsers: true,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: true,
    canManageBeds: true,
    canEditSettings: false,
  },
  doctor: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'patients', 'appointments', 'opd', 'consultation', 'prescriptions', 'laboratory', 'radiology', 'records', 'ot', 'discharge'],
    canManageUsers: false,
    canEditClinicalNotes: true,
    canPrescribeMeds: true,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  nurse: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'patients', 'ipd', 'nursing', 'beds', 'emergency', 'prescriptions', 'bloodbank'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: true,
    canEditSettings: false,
  },
  receptionist: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'patients', 'appointments', 'opd', 'billing', 'ambulance'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: true,
    canManageBeds: false,
    canEditSettings: false,
  },
  pharmacist: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'pharmacy', 'prescriptions', 'inventory'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: true,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  lab_technician: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'laboratory', 'inventory'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: true,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  radiology_technician: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'radiology', 'inventory'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  accountant: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'billing', 'insurance', 'finance', 'reports'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: true,
    canManageBeds: false,
    canEditSettings: false,
  },
  hr_staff: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'staff', 'reports'],
    canManageUsers: true,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  patient: {
    canViewDashboard: false,
    allowedModules: ['patient-portal', 'documents'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  },
  insurance_staff: {
    canViewDashboard: true,
    allowedModules: ['dashboard', 'insurance', 'billing', 'reports'],
    canManageUsers: false,
    canEditClinicalNotes: false,
    canPrescribeMeds: false,
    canDispensePharmacy: false,
    canVerifyLab: false,
    canManageBilling: false,
    canManageBeds: false,
    canEditSettings: false,
  }
};

interface AuthContextType {
  currentUser: User;
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
  ROLE_PERMISSIONS: typeof ROLE_PERMISSIONS;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  login: (email: string, password?: string, role?: UserRole) => boolean;
  loginAs: (email: string) => boolean;
  logout: () => void;
  setAuthenticated: (val: boolean) => void;
  permissions: RolePermission;
  demoUsers: User[];
  isRoleAllowed: (moduleId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('inbox_hms_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS[0]; // Default Super Admin
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authSaved = localStorage.getItem('inbox_hms_auth');
    if (authSaved !== null) {
      return authSaved === 'true';
    }
    return true; // Default authenticated so user can preview right away
  });

  useEffect(() => {
    localStorage.setItem('inbox_hms_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('inbox_hms_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const switchRole = (role: UserRole) => {
    const matched = DEMO_USERS.find(u => u.role === role) || {
      id: `USR-${Date.now()}`,
      name: `Demo ${role.replace('_', ' ')}`,
      email: `${role}@demo.com`,
      role,
      department: 'Inbox Health'
    };
    setCurrentUser(matched);
    setIsAuthenticated(true);
  };

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const login = (email: string, _password?: string, role?: UserRole) => {
    let target = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target && role) {
      target = DEMO_USERS.find(u => u.role === role);
    }
    if (!target) {
      target = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: role || 'doctor',
        department: 'Clinical Health Department'
      };
    }
    setCurrentUser(target);
    setIsAuthenticated(true);
    return true;
  };

  const loginAs = (email: string) => {
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const setAuthenticated = (val: boolean) => {
    setIsAuthenticated(val);
  };

  const permissions = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.super_admin;

  const isRoleAllowed = (moduleId: string): boolean => {
    if (currentUser.role === 'super_admin') return true;
    return permissions.allowedModules.includes(moduleId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        role: currentUser.role,
        isAuthenticated,
        ROLE_PERMISSIONS,
        switchRole,
        switchUser,
        login,
        loginAs,
        logout,
        setAuthenticated,
        permissions,
        demoUsers: DEMO_USERS,
        isRoleAllowed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
