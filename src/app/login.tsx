import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../services/api";
import { login } from "../services/usuarioService";
import { validarLogin } from "../utils/validation";

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    const dados = { email: email.trim(), senha };
    const erroValidacao = validarLogin(dados);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      const resp = await login(dados);
      entrar(resp.usuario);
      router.replace("/(tabs)/inicio");
    } catch (e) {
      setErro((e as ApiError).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Entrar</Text>

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
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/cadastro")}>
          <Text style={styles.link}>Criar uma conta</Text>
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
    backgroundColor: "#e77810",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#e77810", textAlign: "center", marginTop: 4 },
});
