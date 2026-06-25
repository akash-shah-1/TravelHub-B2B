import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "admin" | "agent";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  section: string;
  setSection: (s: string) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  const [section, setSection] = useState<string>("overview");

  const setRole = (r: Role) => {
    setRoleState(r);
    setSection(r === "admin" ? "overview" : "dashboard");
  };

  return (
    <RoleContext.Provider value={{ role, setRole, section, setSection }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
