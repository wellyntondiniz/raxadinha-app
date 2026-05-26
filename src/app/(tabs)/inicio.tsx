import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

const ORANGE = '#FF6B00';
const ORANGE_DARK = '#E05A00';
const ORANGE_LIGHT = '#FFF3EB';

type MenuItem = {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  ativo: boolean;
};

function MenuCard({ icon, label, description, onPress, ativo }: MenuItem) {
  return (
    <Pressable
      onPress={ativo ? onPress : undefined}
      style={({ pressed }) => [
        styles.card,
        ativo && pressed && styles.cardPressed,
        !ativo && styles.cardInativo,
      ]}>
      <View style={[styles.cardIconBox, !ativo && styles.cardIconBoxInativo]}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>

      <View style={styles.cardTexto}>
        <Text style={[styles.cardLabel, !ativo && styles.cardLabelInativo]}>
          {label}
        </Text>
        <Text style={styles.cardDescricao}>{description}</Text>
        {!ativo && (
          <Text style={styles.emBreve}>Em breve</Text>
        )}
      </View>

      <Text style={[styles.seta, !ativo && styles.setaInativa]}>›</Text>
    </Pressable>
  );
}

export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header laranja */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>R$</Text>
        </View>
        <View>
          <Text style={styles.appNome}>Raxadinha</Text>
          <Text style={styles.appSubtitulo}>Compare preços e economize</Text>
        </View>
      </View>

      {/* Menu */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.secaoTitulo}>Menu principal</Text>

        <MenuCard
          icon="📦"
          label="Produtos"
          description="Gerencie o catálogo de produtos"
          onPress={() => router.push('/produtos')}
          ativo
        />
        <MenuCard
          icon="🛍️"
          label="Compras"
          description="Acesse o histórico de compras"
          onPress={() => {}}
          ativo={false}
        />
        <MenuCard
          icon="💰"
          label="Comparar Preços"
          description="Encontre o menor preço entre lojas"
          onPress={() => {}}
          ativo={false}
        />
        <MenuCard
          icon="🏪"
          label="Estabelecimentos"
          description="Veja os mercados e lojas cadastrados"
          onPress={() => {}}
          ativo={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: ORANGE,
  },

  // Header
  header: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  appNome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  appSubtitulo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },

  // Scroll body (fundo branco arredondado)
  scroll: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
    flexGrow: 1,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: ORANGE_LIGHT,
    borderColor: ORANGE,
  },
  cardInativo: {
    opacity: 0.55,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: ORANGE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconBoxInativo: {
    backgroundColor: '#f5f5f5',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTexto: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cardLabelInativo: {
    color: '#555',
  },
  cardDescricao: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  emBreve: {
    fontSize: 11,
    fontWeight: '600',
    color: ORANGE,
    marginTop: 2,
  },
  seta: {
    fontSize: 24,
    color: ORANGE,
    fontWeight: '300',
    lineHeight: 28,
  },
  setaInativa: {
    color: '#ccc',
  },
});
