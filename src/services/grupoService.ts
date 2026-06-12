import BASE_URL from './api';

export type Grupo = {
  id?: number;
  nome: string;
  descricao: string;
};

const URL = `${BASE_URL}/grupos`;

export async function listarGrupos(): Promise<Grupo[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Erro ao listar grupos');
  return res.json();
}

export async function salvarGrupo(grupo: Omit<Grupo, 'id'>): Promise<Grupo> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grupo),
  });
  if (!res.ok) throw new Error('Erro ao salvar grupo');
  return res.json();
}

export async function atualizarGrupo(id: number, grupo: Omit<Grupo, 'id'>): Promise<Grupo> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grupo),
  });
  if (!res.ok) throw new Error('Erro ao atualizar grupo');
  return res.json();
}

export async function excluirGrupo(id: number): Promise<void> {
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir grupo');
}

export async function adicionarUsuarioAoGrupo(grupoId: number, usuarioNome: string): Promise<Grupo> {
  const res = await fetch(`${URL}/${grupoId}/usuarios/nome/${usuarioNome}`, { method: 'POST' });
  if (!res.ok) throw new Error('Erro ao adicionar usuário');
  return res.json();
}

export async function vincularEventoExistente(grupoId: number, eventoNome: string): Promise<Grupo> {
  const res = await fetch(`${URL}/${grupoId}/eventos/nome/${eventoNome}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Erro ao vincular evento');
  return res.json();
}
