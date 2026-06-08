
export const SENHA_MIN = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarNome(nome: string): string | null {
  if (!nome.trim()) return "Informe o nome";
  return null;
}

export function validarEmail(email: string): string | null {
  if (!email.trim()) return "Informe o e-mail";
  if (!EMAIL_REGEX.test(email.trim())) return "E-mail inválido";
  return null;
}

export function validarSenha(senha: string, obrigatoria = true): string | null {
  if (!senha) return obrigatoria ? "Informe a senha" : null;
  if (senha.length < SENHA_MIN) return `A senha deve ter no mínimo ${SENHA_MIN} caracteres`;
  return null;
}

export function validarCadastro(d: { nome: string; email: string; senha: string }): string | null {
  return validarNome(d.nome) ?? validarEmail(d.email) ?? validarSenha(d.senha);
}

export function validarLogin(d: { email: string; senha: string }): string | null {
  return validarEmail(d.email) ?? validarSenha(d.senha);
}
