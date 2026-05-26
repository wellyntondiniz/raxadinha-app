import BASE_URL from './api';

export type UnidadeDeMedida = 'KG' | 'LITROS' | 'UND';

export type Produto = {
  id?: number;
  descricao: string;
  unidadeDeMedida: UnidadeDeMedida;
  quantidade: number;
};

const URL = `${BASE_URL}/produtos`;

export async function listarProdutos(): Promise<Produto[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Erro ao listar produtos');
  return res.json();
}

export async function salvarProduto(produto: Omit<Produto, 'id'>): Promise<Produto> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!res.ok) throw new Error('Erro ao salvar produto');
  return res.json();
}

export async function atualizarProduto(id: number, produto: Omit<Produto, 'id'>): Promise<Produto> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return res.json();
}

export async function excluirProduto(id: number): Promise<void> {
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir produto');
}
