import { Spacing } from '@/constants/theme';
import {
  Evento,
  atualizarEvento,
  excluirEvento,
  listarEventos,
  salvarEvento
} from '@/services/eventoService';
import { erro, sucesso } from '@/utils/notify';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ORANGE = '#FF6B00';
const ORANGE_DARK = '#E05A00';

const FORM_VAZIO = {
nome: '',
descricao: '',
grupoId: null as number | null,
data_inicio: null as Date | null,
data_termino: null as Date | null
};

export default function EventoScreen() {
const [eventos, setEventos] = useState<Evento[]>([]);
const [carregando, setCarregando] = useState(true);
const [salvando, setSalvando] = useState(false);
const [modalVisivel, setModalVisivel] = useState(false);
const [editandoId, setEditandoId] = useState<number | null>(null);
const [form, setForm] = useState(FORM_VAZIO);
const [mostrarInicio, setMostrarInicio] = useState(false);
const [mostrarTermino, setMostrarTermino] = useState(false);
const [modalExcluir, setModalExcluir] = useState(false);
const [itemSelecionado, setItemSelecionado] = useState<Evento | null>(null);
const [pesquisa, setPesquisa] = useState('');
const eventosFiltrados = eventos.filter(
  item =>
    item.ativo &&
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
);
const editando = editandoId !== null;

async function carregar() {
setCarregando(true);
try {
    const data = await listarEventos();
    setEventos(data);
} catch {
    erro('Erro', 'Não foi possível carregar os eventos.');
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

function abrirEditar(evento: Evento) {
setEditandoId(evento.id!);
setForm({
    nome: evento.nome,
    descricao: evento.descricao,
    grupoId: evento.grupoId,
    data_inicio: evento.dataInicio
    ? new Date(evento.dataInicio)
    : null,
  data_termino: evento.dataTermino
    ? new Date(evento.dataTermino)
    : null
});
setModalVisivel(true);
}

async function confirmarExclusao() {
  if (!itemSelecionado) return;

  try {
    await excluirEvento(itemSelecionado.id!);
    await carregar();
  } catch {
    erro("Erro", "Não foi possível excluir");
  } finally {
    sucesso("Sucesso", "Exclusão realizada com sucesso")
    setModalExcluir(false);
    setItemSelecionado(null);
  }
}

function validarFormulario() {
  if (
    !form.grupoId ||
    form.grupoId === null ||
    form.grupoId === undefined ||
    form.grupoId < 1
  ) {
    erro("Erro", "Grupo inválido");
    return false;
  }
  
  if (!form.nome || form.nome.trim() === "") {
    erro("Erro", "Nome é obrigatório");
    return false;
  }

  if (form.data_termino && !form.data_inicio) {
    erro("Erro", "Data de término só pode existir se houver data de início");
    return false;
  }

  if (form.data_inicio && form.data_termino) {
    if (form.data_termino < form.data_inicio) {
      erro("Erro", "Data de término não pode ser antes da data de início");
      return false;
    }
  }
  
  return true;
}
async function salvar() {
if (!validarFormulario()) return;

setSalvando(true);
try {
    const dados = {
    nome: form.nome.trim(),
    descricao: form.descricao.trim(),
    grupoId: form.grupoId!,
    ativo: true,
    dataInicio: form.data_inicio!,
    dataTermino: form.data_termino!,
    };
    if (editandoId !== null) {
    await atualizarEvento(editandoId, dados);
    } else {
    await salvarEvento(dados);
    }
    setModalVisivel(false);
    await carregar();
} catch {
    erro('Erro', 'Não foi possível salvar o evento.');
} finally {
    sucesso("Sucesso", "Evento salvo com sucesso!");
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
    <Text style={styles.titulo}>Eventos</Text>
    <Pressable onPress={abrirNovo} style={styles.novoBotao}>
        <Text style={styles.novoTexto}>+ Novo</Text>
    </Pressable>
    </View>

    <View style={styles.pesquisaContainer}>
      <TextInput
        style={styles.pesquisaInput}
        placeholder="Pesquisar evento..."
        value={pesquisa}
        onChangeText={setPesquisa}
        placeholderTextColor="#999"
      />
    </View>

    {/* Lista */}
    {carregando ? (
    <ActivityIndicator size="large" color={ORANGE} style={styles.loader} />
    ) : (
    <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
        <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>Nenhum evento cadastrado.</Text>
            <Text style={styles.vazioSub}>Toque em "+ Novo" para adicionar.</Text>
        </View>
        }
        renderItem={({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
            <Text style={styles.cardDescricao}>{item.nome}</Text>
            <Text style={styles.cardSub}>
            </Text>
            </View>
            <View style={styles.cardAcoes}>
            <Pressable
                onPress={() => {
                    abrirEditar(item)}}
                style={({ pressed }) => [styles.editarBtn, pressed && { opacity: 0.7 }]}>
                <Text style={styles.editarTexto}>Editar</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    setItemSelecionado(item);
                    setModalExcluir(true);
                    }}
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
            {editandoId !== null ? 'Editar evento' : 'Novo evento'}
            </Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
            placeholder="Ex: Aniversário do Jorgin"
            placeholderTextColor="#bbb"
            autoCapitalize="sentences"
            />

            <Text style={styles.label}>Descrição *</Text>
            <TextInput
            style={styles.input}
            value={form.descricao}
            onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
            placeholder="Digite uma descrição"
            placeholderTextColor="#bbb"
            autoCapitalize="sentences"
            />

            <Text style={styles.label}>Grupo *</Text>

            <TextInput
              style={styles.input}
              value={form.grupoId?.toString() ?? ''}
              editable={!editando}
              onChangeText={(v) =>
                setForm((f) => ({
                  ...f,
                  grupoId: v === '' ? null : Number(v)
                }))
              }
              keyboardType="numeric"
              placeholder="Digite o ID do grupo"
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Data de Início*</Text>

            {/* WEB */}
            {Platform.OS === 'web' && (
            <input
                type="date"
                value={
                form.data_inicio
                    ? new Date(form.data_inicio).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                setForm((f) => ({
                    ...f,
                    data_inicio: new Date(e.target.value)
                }))
                }
            />
            )}

            {/* MOBILE */}
            {Platform.OS !== 'web' && (
            <>
                <Pressable
                style={styles.input}
                onPress={() => setMostrarInicio(true)}
                >
                <Text style={{ color: form.data_inicio ? '#1a1a1a' : '#bbb' }}>
                    {form.data_inicio
                    ? form.data_inicio.toLocaleDateString('pt-BR')
                    : 'Selecionar data'}
                </Text>
                </Pressable>

                {mostrarInicio && (
                <DateTimePicker
                    value={form.data_inicio || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                    setMostrarInicio(false);
                    if (date) {
                        setForm((f) => ({ ...f, data_inicio: date }));
                    }
                    }}
                />
                )}
            </>
            )}

            
            
            <Text style={styles.label}>Data de Término*</Text>

            {/* WEB */}
            {Platform.OS === 'web' && (
            <input
                type="date"
                value={
                form.data_termino
                    ? new Date(form.data_termino).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                setForm((f) => ({
                    ...f,
                    data_termino: new Date(e.target.value)
                }))
                }
            />
            )}

            {/* MOBILE */}
            {Platform.OS !== 'web' && (
            <>
                <Pressable
                style={styles.input}
                onPress={() => setMostrarTermino(true)}
                >
                <Text style={{ color: form.data_termino ? '#1a1a1a' : '#bbb' }}>
                    {form.data_termino
                    ? form.data_termino.toLocaleDateString('pt-BR')
                    : 'Selecionar data'}
                </Text>
                </Pressable>

                {mostrarTermino && (
                <DateTimePicker
                    value={form.data_termino || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                    setMostrarTermino(false);
                    if (date) {
                        setForm((f) => ({ ...f, data_termino: date }));
                    }
                    }}
                />
                )}
            </>
            )}

            <View style={styles.modalAcoes}>
            <Pressable
                onPress={() =>
                    setModalVisivel(false)
                }
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
    <Modal
      visible={modalExcluir}
      transparent
      animationType="fade"
      onRequestClose={() => setModalExcluir(false)}
    >
      <View style={styles.modalExcluirOverlay}>
        <View style={styles.modalExcluirContainer}>

          <Text style={styles.modalExcluirTitulo}>
            Confirmar exclusão
          </Text>

          <Text style={styles.modalExcluirTexto}>
            Deseja realmente excluir{" "}
            <Text style={styles.modalExcluirNome}>
              {itemSelecionado?.nome}
            </Text>
            ?
          </Text>

          <View style={styles.modalExcluirAcoes}>

            <Pressable
              style={styles.modalExcluirCancelar}
              onPress={() => setModalExcluir(false)}
            >
              <Text style={styles.modalExcluirCancelarTexto}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={styles.modalExcluirConfirmar}
              onPress={() => confirmarExclusao()}
            >
              <Text style={styles.modalExcluirConfirmarTexto}>
                Excluir
              </Text>
            </Pressable>

          </View>

        </View>
      </View>
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
},
cardDescricao: {
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
unidadeRow: {
flexDirection: 'row',
gap: Spacing.two,
},
unidadeBtn: {
flex: 1,
borderWidth: 1.5,
borderColor: '#ddd',
borderRadius: Spacing.two,
paddingVertical: Spacing.two,
alignItems: 'center',
backgroundColor: '#fafafa',
},
unidadeBtnSelecionado: {
borderColor: ORANGE,
backgroundColor: ORANGE,
},
unidadeTexto: {
fontSize: 14,
fontWeight: '600',
color: '#555',
},
unidadeTextoSelecionado: {
color: '#fff',
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
modalExcluirOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalExcluirContainer: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
  width: '80%',
  gap: 12,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 5,
},

modalExcluirTitulo: {
  fontSize: 18,
  fontWeight: '700',
  color: '#1a1a1a',
},

modalExcluirTexto: {
  fontSize: 15,
  color: '#555',
  lineHeight: 22,
},

modalExcluirNome: {
  fontWeight: '700',
  color: '#1a1a1a',
},

modalExcluirAcoes: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 10,
},

modalExcluirCancelar: {
  flex: 1,
  paddingVertical: 10,
  backgroundColor: '#ddd',
  borderRadius: 8,
  alignItems: 'center',
},

modalExcluirCancelarTexto: {
  color: '#333',
  fontSize: 15,
  fontWeight: '600',
},

modalExcluirConfirmar: {
  flex: 1,
  paddingVertical: 10,
  backgroundColor: '#e53935',
  borderRadius: 8,
  alignItems: 'center',
},

modalExcluirConfirmarTexto: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
},

pesquisaContainer: {
  paddingHorizontal: Spacing.three,
  paddingTop: Spacing.two,
},

pesquisaInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: Spacing.two,
  paddingHorizontal: Spacing.three,
  paddingVertical: Spacing.two,
  backgroundColor: '#fafafa',
  fontSize: 16,
  color: '#1a1a1a',
},
});
