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
  Estabelecimento,
  listarEstabelecimentos,
  salvarEstabelecimento,
  atualizarEstabelecimento,
  excluirEstabelecimento,
} from '@/services/estabelecimentoService';

const ORANGE = '#FF6B00';

const FORM_VAZIO = {
  nome: '',
  endereco: '',
  latitude: '',
  longitude: '',
};

export default function EstabelecimentosScreen() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);

  async function carregar() {
    setCarregando(true);
    try {
      const data = await listarEstabelecimentos();
      setEstabelecimentos(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os estabelecimentos.');
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

  function abrirEditar(est: Estabelecimento) {
    setEditandoId(est.id!);
    setForm({
      nome: est.nome,
      endereco: est.endereco,
      latitude: String(est.latitude),
      longitude: String(est.longitude),
    });
    setModalVisivel(true);
  }

  function confirmarExclusao(id: number, nome: string) {
    Alert.alert('Excluir estabelecimento', `Deseja excluir "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirEstabelecimento(id);
            await carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o estabelecimento.');
          }
        },
      },
    ]);
  }

  function verEstabelecimento(est: Estabelecimento) {
    Alert.alert(
      'Estabelecimento selecionado',
      `Nome: ${est.nome}\nEndereço: ${est.endereco}\nLatitude: ${est.latitude}\nLongitude: ${est.longitude}`
    );
  }

  async function salvar() {
    if (!form.nome.trim() || !form.endereco.trim()) {
      Alert.alert('Atenção', 'Informe nome e endereço.');
      return;
    }
    const lat = parseFloat(form.latitude.replace(',', '.'));
    const lng = parseFloat(form.longitude.replace(',', '.'));
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Atenção', 'Informe coordenadas válidas.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome: form.nome.trim(),
        endereco: form.endereco.trim(),
        latitude: lat,
        longitude: lng,
      };
      if (editandoId !== null) {
        await atualizarEstabelecimento(editandoId, dados);
      } else {
        await salvarEstabelecimento(dados);
      }
      setModalVisivel(false);
      await carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o estabelecimento.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.voltar}>{'← Voltar'}</Text>
        </Pressable>
        <Text style={styles.titulo}>Estabelecimentos</Text>
        <Pressable onPress={abrirNovo} style={styles.novoBotao}>
          <Text style={styles.novoTexto}>Novo</Text>
        </Pressable>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={ORANGE} style={styles.loader} />
      ) : (
        <FlatList
          data={estabelecimentos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          nestedScrollEnabled={true}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>Nenhum estabelecimento cadastrado.</Text>
              <Text style={styles.vazioSub}>Toque em "Novo" para adicionar.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardDescricao}>{item.nome}</Text>
                <Text style={styles.cardSub}>{item.endereco}</Text>
              </View>
              <View style={styles.cardAcoes}>
                <Pressable 
                  onPress={() => verEstabelecimento(item)} 
                  style={styles.verBtn}
                  hitSlop={8}
                >
                  <Text style={styles.verTexto}>Ver</Text>
                </Pressable>
                <Pressable 
                  onPress={() => abrirEditar(item)} 
                  style={styles.editarBtn}
                  hitSlop={8}
                >
                  <Text style={styles.editarTexto}>Editar</Text>
                </Pressable>
                <Pressable 
                  onPress={() => confirmarExclusao(item.id!, item.nome)} 
                  style={styles.excluirBtn}
                  hitSlop={8}
                >
                  <Text style={styles.excluirTexto}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.overlayScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modal}>
              <Text style={styles.modalTitulo}>
                {editandoId !== null ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
              </Text>

              <Text style={styles.label}>Nome *</Text>
              <TextInput style={styles.input} value={form.nome} onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))} />

              <Text style={styles.label}>Endereço *</Text>
              <TextInput style={styles.input} value={form.endereco} onChangeText={(v) => setForm((f) => ({ ...f, endereco: v }))} />

              <Text style={styles.label}>Latitude *</Text>
              <TextInput style={styles.input} value={form.latitude} onChangeText={(v) => setForm((f) => ({ ...f, latitude: v }))} keyboardType="numeric" />

              <Text style={styles.label}>Longitude *</Text>
              <TextInput style={styles.input} value={form.longitude} onChangeText={(v) => setForm((f) => ({ ...f, longitude: v }))} keyboardType="numeric" />

              <View style={styles.modalAcoes}>
                <Pressable onPress={() => setModalVisivel(false)} style={styles.cancelarBtn}>
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={salvar} style={styles.salvarBtn}>
                  <Text style={styles.salvarTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
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
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.two,
  },
  voltar: { color: ORANGE, fontWeight: '600' },
  titulo: { fontSize: 20, fontWeight: '700' },
  novoBotao: { backgroundColor: ORANGE, padding: Spacing.two, borderRadius: Spacing.two },
  novoTexto: { color: '#fff', fontWeight: '700' },

  loader: { marginTop: 20 },
  lista: { padding: Spacing.two },

  vazio: { alignItems: 'center', marginTop: 40 },
  vazioTexto: { fontSize: 16, fontWeight: '600' },
  vazioSub: { fontSize: 14, color: '#777' },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.two,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cardInfo: { flex: 1 },
  cardDescricao: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 14, color: '#555' },
  cardAcoes: { flexDirection: 'row', gap: Spacing.two },

  // 🔹 Botões laranja e branco
  verBtn: { padding: Spacing.one, backgroundColor: ORANGE, borderRadius: Spacing.one },
  verTexto: { color: '#fff', fontWeight: '600' },

  editarBtn: { padding: Spacing.one, backgroundColor: ORANGE, borderRadius: Spacing.one },
  editarTexto: { color: '#fff', fontWeight: '600' },

  excluirBtn: { padding: Spacing.one, backgroundColor: ORANGE, borderRadius: Spacing.one },
  excluirTexto: { color: '#fff', fontWeight: '600' },

  // 🔹 Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  overlayScroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.two },
  modal: { backgroundColor: '#fff', borderRadius: Spacing.two, padding: Spacing.three },
  modalTitulo: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.two },

  label: { fontSize: 14, fontWeight: '600', marginTop: Spacing.two },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: Spacing.two,
    padding: Spacing.two,
    marginTop: Spacing.one,
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
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  cancelarTexto: { fontSize: 16, fontWeight: '600', color: '#555' },
  salvarBtn: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  salvarTexto: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
