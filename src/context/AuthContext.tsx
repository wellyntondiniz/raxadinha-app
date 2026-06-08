import React, { createContext, useContext, useMemo, useState } from "react";
import type { Usuario } from "../services/usuarioService";


type AuthContextType = {
  usuario: Usuario | null;
  estaLogado: boolean;
  entrar: (usuario: Usuario) => void;
  sair: () => void;
  atualizarUsuario: (usuario: Usuario) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const value = useMemo<AuthContextType>(
    () => ({
      usuario,
      estaLogado: usuario !== null,
      entrar: (u) => setUsuario(u),
      sair: () => setUsuario(null),
      atualizarUsuario: (u) => setUsuario(u),
    }),
    [usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
