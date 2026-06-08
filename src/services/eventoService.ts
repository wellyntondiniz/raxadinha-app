import BASE_URL from './api';


export type Evento = {
  id?: number;
  nome: string;
  grupo_id?: number;
  descricao: string;
  ativo: boolean;
  dataInicio: Date;
  dataTermino: Date;
};

const URL = `${BASE_URL}/eventos`;

export async function listarEventos(): Promise<Evento[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Erro ao listar eventos');
  return res.json();
}

export async function salvarEvento(evento: Omit<Evento, 'id'>): Promise<Evento> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  if (!res.ok) throw new Error('Erro ao salvar Evento');
  return res.json();
}

export async function atualizarEvento(id: number, evento: Omit<Evento, 'id'>): Promise<Evento> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  if (!res.ok) throw new Error('Erro ao atualizar evento');
  return res.json();
}

export async function excluirEvento(id: number): Promise<void> {
  const res = await fetch(`${URL}/${id}/desativar`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Erro ao excluir evento');
}
