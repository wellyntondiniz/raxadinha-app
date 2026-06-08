import { api } from "./api";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type LoginResposta = {
  mensagem: string;
  usuario: Usuario;
};

// RF01 - Cadastro
export function cadastrar(dados: { nome: string; email: string; senha: string }) {
  return api<Usuario>("/usuarios", { method: "POST", body: dados });
}

// RF02 - Login
export function login(dados: { email: string; senha: string }) {
  return api<LoginResposta>("/usuarios/login", { method: "POST", body: dados });
}

// RF03 - Editar
export function atualizar(
  id: number,
  dados: { nome: string; email: string; senha?: string }
) {
  return api<Usuario>(`/usuarios/${id}`, { method: "PUT", body: dados });
}

// RF04 - Excluir conta
export function excluir(id: number) {
  return api<void>(`/usuarios/${id}`, { method: "DELETE" });
}
