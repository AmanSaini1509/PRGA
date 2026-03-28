import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  requiredSkills: string[];
  setRequiredSkills: (skills: string[]) => void;
  roadmap: string[];
  setRoadmap: (roadmap: string[]) => void;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSkills, setUserSkillsState] = useState<string[]>([]);
  const [jobTitle, setJobTitleState] = useState<string>('');
  const [requiredSkills, setRequiredSkillsState] = useState<string[]>([]);
  const [roadmap, setRoadmapState] = useState<string[]>([]);
  
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));

  const isAuthenticated = !!token;

  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  // Check for token expiration on mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  const setUserSkills = (skills: string[]) => {
    setUserSkillsState(skills);
  };

  const setJobTitle = (title: string) => {
    setJobTitleState(title);
  }

  const setRequiredSkills = (skills: string[]) => {
    setRequiredSkillsState(skills);
  }

  const setRoadmap = (roadmap: string[]) => {
    setRoadmapState(roadmap);
  }

  return (
    <UserContext.Provider value={{ 
      userSkills, setUserSkills, 
      jobTitle, setJobTitle, 
      requiredSkills, setRequiredSkills, 
      roadmap, setRoadmap,
      token, userId, isAuthenticated, login, logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
