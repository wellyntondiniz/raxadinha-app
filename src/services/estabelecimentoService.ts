import AsyncStorage from '@react-native-async-storage/async-storage';

export type Estabelecimento = {
  id?: number;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
};

const STORAGE_KEY = 'estabelecimentos';

export async function listarEstabelecimentos(): Promise<Estabelecimento[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function salvarEstabelecimento(dados: Omit<Estabelecimento, 'id'>): Promise<void> {
  const lista = await listarEstabelecimentos();
  const novo: Estabelecimento = { id: Date.now(), ...dados };
  lista.push(novo);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export async function atualizarEstabelecimento(id: number, dados: Omit<Estabelecimento, 'id'>): Promise<void> {
  const lista = await listarEstabelecimentos();
  const novaLista = lista.map((e) => (e.id === id ? { id, ...dados } : e));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

export async function excluirEstabelecimento(id: number): Promise<void> {
  const lista = await listarEstabelecimentos();
  const novaLista = lista.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}
