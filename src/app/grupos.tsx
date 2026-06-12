import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import {
  Grupo,
  vincularEventoExistente,
  adicionarUsuarioAoGrupo,
  atualizarGrupo,
  excluirGrupo,
  listarGrupos,
  salvarGrupo,
} from '@/services/grupoService';

const ORANGE = '#FF6B00';
const ORANGE_DARK = '#E05A00';

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  eventoNome: '',
  usuarioNome: '',
};

export default function GruposScreen() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);

  async function carregar() {
    setCarregando(true);
    try {
      const data = await listarGrupos();
      setGrupos(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os grupos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setModalVisivel(true);
  }

  function abrirEditar(grupo: Grupo) {
    setEditandoId(grupo.id!);
    setForm({
      nome: grupo.nome,
      descricao: grupo.descricao || '',
      eventoNome: '',
      usuarioNome: '',
    });
    setModalVisivel(true);
  }

  function confirmarExclusao(id: number, nome: string) {
    Alert.alert('Excluir grupo', `Deseja excluir "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirGrupo(id);
            await carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o grupo.');
          }
        },
      },
    ]);
  }

  async function salvar() {
    if (!form.nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do grupo.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
      };
      
      let grupoSalvoId = editandoId;
      if (editandoId !== null) {
        await atualizarGrupo(editandoId, dados);
      } else {
        const novo = await salvarGrupo(dados);
        grupoSalvoId = novo.id!;
      }

      if (grupoSalvoId && form.eventoNome.trim()) {
        await vincularEventoExistente(grupoSalvoId, form.eventoNome.trim());
      }

      if (grupoSalvoId && form.usuarioNome.trim()) {
        await adicionarUsuarioAoGrupo(grupoSalvoId, form.usuarioNome.trim());
      }
      setModalVisivel(false);
      await carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o grupo.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.voltar}>{'← Voltar'}</Text>
        </Pressable>
        <Text style={styles.titulo}>Grupos</Text>
        <Pressable onPress={abrirNovo} style={styles.novoBotao}>
          <Text style={styles.novoTexto}>+ Novo</Text>
        </Pressable>
      </View>

      {/* Lista */}
      {carregando ? (
        <ActivityIndicator size="large" color={ORANGE} style={styles.loader} />
      ) : (
        <FlatList
          data={grupos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>Nenhum grupo criado.</Text>
              <Text style={styles.vazioSub}>Toque em "+ Novo" para adicionar.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{item.nome}</Text>
                {item.descricao ? (
                  <Text style={styles.cardSub}>{item.descricao}</Text>
                ) : null}
              </View>
              <View style={styles.cardAcoes}>
                <Pressable
                  onPress={() => abrirEditar(item)}
                  style={({ pressed }) => [styles.editarBtn, pressed && { opacity: 0.7 }]}>
                  <Text style={styles.editarTexto}>Editar</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmarExclusao(item.id!, item.nome)}
                  style={({ pressed }) => [styles.excluirBtn, pressed && { opacity: 0.7 }]}>
                  <Text style={styles.excluirTexto}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal de formulário */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.overlayScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modal}>
              <Text style={styles.modalTitulo}>
                {editandoId !== null ? 'Editar Grupo' : 'Novo Grupo'}
              </Text>

              <Text style={styles.label}>Nome do Grupo *</Text>
              <TextInput
                style={styles.input}
                value={form.nome}
                onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
                placeholder="Ex: Churrasco da Turma"
                placeholderTextColor="#bbb"
                autoCapitalize="words"
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.descricao}
                onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
                placeholder="Ex: Grupo para dividir as despesas do churrasco"
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
              />

              <Text style={styles.label}>Nome do Evento para adicionar (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={form.eventoNome}
                onChangeText={(v) => setForm((f) => ({ ...f, eventoNome: v }))}
                placeholder="Ex: Churrasco"
                placeholderTextColor="#bbb"
                autoCapitalize="words"
              />

              <Text style={styles.label}>Nome do Usuário para adicionar (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={form.usuarioNome}
                onChangeText={(v) => setForm((f) => ({ ...f, usuarioNome: v }))}
                placeholder="Ex: João"
                placeholderTextColor="#bbb"
                autoCapitalize="words"
              />

              <View style={styles.modalAcoes}>
                <Pressable
                  onPress={() => setModalVisivel(false)}
                  style={({ pressed }) => [styles.cancelarBtn, pressed && { opacity: 0.7 }]}>
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={salvar}
                  disabled={salvando}
                  style={({ pressed }) => [
                    styles.salvarBtn,
                    (pressed || salvando) && { opacity: 0.7 },
                  ]}>
                  {salvando ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.salvarTexto}>Salvar</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  voltar: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  novoBotao: {
    backgroundColor: ORANGE,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  novoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
  },
  lista: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.six,
    gap: Spacing.one,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  vazioSub: {
    fontSize: 13,
    color: '#aaa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.two,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
  },
  cardAcoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  editarBtn: {
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  editarTexto: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: '600',
  },
  excluirBtn: {
    borderWidth: 1.5,
    borderColor: '#e53935',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  excluirTexto: {
    color: '#e53935',
    fontSize: 13,
    fontWeight: '600',
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  overlayScroll: {
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginTop: Spacing.one,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalAcoes: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  cancelarBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  cancelarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  salvarBtn: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  salvarTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
