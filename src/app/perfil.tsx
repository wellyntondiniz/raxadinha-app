import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../services/api";
import { atualizar, excluir } from "../services/usuarioService";
import { validarEmail, validarNome, validarSenha } from "../utils/validation";

export default function PerfilScreen() {
  const { usuario, atualizarUsuario, sair } = useAuth();

  useEffect(() => {
    if (!usuario) {
      router.replace("/login");
    }
  }, [usuario]);

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  if (!usuario) {
    return null;
  }

  async function handleSalvar() {
    const dadosLimpos = { nome: nome.trim(), email: email.trim() };
    const erroValidacao =
      validarNome(dadosLimpos.nome) ??
      validarEmail(dadosLimpos.email) ??
      validarSenha(senha, false);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      const atualizado = await atualizar(usuario!.id, {
        ...dadosLimpos,
        senha: senha ? senha : undefined,
      });
      atualizarUsuario(atualizado);
      setSenha("");
      Alert.alert("Sucesso", "Dados atualizados.");
    } catch (e) {
      setErro((e as ApiError).message);
    } finally {
      setCarregando(false);
    }
  }

  function handleExcluir() {
    Alert.alert("Excluir conta", "Tem certeza? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluir(usuario!.id);
            sair();
            router.replace("/login");
          } catch (e) {
            setErro((e as ApiError).message);
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.tela}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Meu perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Nova senha (opcional)"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleSalvar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar alterações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSair}
          onPress={() => {
            sair();
            router.replace("/login");
          }}
        >
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleExcluir}>
          <Text style={styles.excluir}>Excluir minha conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
  },
  erro: { color: "#D32F2F", fontSize: 14 },
  botao: {
    backgroundColor: "#208AEF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
  botaoSair: {
    borderWidth: 1,
    borderColor: "#208AEF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoSairTexto: { color: "#208AEF", fontSize: 16, fontWeight: "600" },
  excluir: { color: "#D32F2F", textAlign: "center", marginTop: 4 },
});
