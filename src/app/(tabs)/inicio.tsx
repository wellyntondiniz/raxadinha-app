// =============================================================================
// src/app/(tabs)/inicio.tsx  —  Home Raxadinha (variação B · cards coloridos)
// -----------------------------------------------------------------------------
// Requer react-native-svg (padrão Expo):  npx expo install react-native-svg
// =============================================================================

import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Spacing } from '@/constants/theme';

const ORANGE = '#FF6B00';
const ORANGE_DARK = '#E05A00';
const ORANGE_TINT = '#FFF3EB';
const INK = '#1A1A1A';
const MUTED = '#8A8A8A';

// ----------------------------------------------------------------------------
// Marca: estrela facetada (pinwheel laranja)
// ----------------------------------------------------------------------------
function StarMark({ size = 30 }: { size?: number }) {
  const L = '#FFA32E';
  const D = '#E2580A';
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Path d="M100 18 L100 100 L80 80 Z" fill={L} />
      <Path d="M100 18 L120 80 L100 100 Z" fill={D} />
      <Path d="M182 100 L120 80 L100 100 Z" fill={L} />
      <Path d="M182 100 L100 100 L120 120 Z" fill={D} />
      <Path d="M100 182 L120 120 L100 100 Z" fill={L} />
      <Path d="M100 182 L100 100 L80 120 Z" fill={D} />
      <Path d="M18 100 L80 120 L100 100 Z" fill={L} />
      <Path d="M18 100 L100 100 L80 80 Z" fill={D} />
    </Svg>
  );
}

// ----------------------------------------------------------------------------
// Ícones (estilo Lucide, stroke 2)
// ----------------------------------------------------------------------------
type IconProps = { color: string; size?: number };

function IconUsers({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx={9} cy={7} r={4} />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}
function IconCalendar({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={4} width={18} height={18} rx={2.5} />
      <Path d="M16 2v4M8 2v4M3 10h18" />
    </Svg>
  );
}
function IconSplit({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 3 4 7l4 4" />
      <Path d="M4 7h13a4 4 0 0 1 0 8h-1" />
      <Path d="m16 21 4-4-4-4" />
      <Path d="M20 17H9" />
    </Svg>
  );
}

type Icon = (p: IconProps) => React.ReactElement;

// ----------------------------------------------------------------------------
// Card padrão (Grupos / Eventos)
// ----------------------------------------------------------------------------
function MenuCard({
  Icon,
  label,
  sub,
  meta,
  onPress,
}: {
  Icon: Icon;
  label: string;
  sub: string;
  meta: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      {/* ícone gigante de fundo */}
      <View style={styles.cardGhost} pointerEvents="none">
        <Icon color={ORANGE} size={120} />
      </View>

      <View style={styles.cardRow}>
        <View style={styles.iconTile}>
          <Icon color={ORANGE} size={24} />
        </View>
        <View style={styles.cardTexto}>
          <Text style={styles.cardLabel}>{label}</Text>
          <Text style={styles.cardSub} numberOfLines={1}>
            {sub}
          </Text>
        </View>
      </View>
      <Text style={styles.cardMeta}>{meta} ›</Text>
    </Pressable>
  );
}

// ----------------------------------------------------------------------------
// Card de destaque (Cotação)
// ----------------------------------------------------------------------------
function CotacaoCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardCotacao, pressed && styles.cardCotacaoPressed]}>
      <View style={styles.cardGhost} pointerEvents="none">
        <IconSplit color="#fff" size={120} />
      </View>
      <View style={styles.cardRow}>
        <View style={styles.iconTileLight}>
          <IconSplit color="#fff" size={24} />
        </View>
        <View style={styles.cardTexto}>
          <Text style={styles.cardLabelLight}>Cotação</Text>
          <Text style={styles.cardSubLight} numberOfLines={1}>
            Veja quem paga e quem recebe
          </Text>
        </View>
      </View>
      <Text style={styles.cardMetaLight}>R$ 240,00 a acertar ›</Text>
    </Pressable>
  );
}

// ----------------------------------------------------------------------------
// Tela
// ----------------------------------------------------------------------------
export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.marca}>
          <StarMark size={30} />
          <Text style={styles.marcaNome}>Raxadinha</Text>
        </View>
        {/* TODO(cadastro): substituir "User" pelas iniciais do usuário logado */}
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>User</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Saudação */}
        {/* TODO(cadastro): substituir "User" pelo nome do usuário logado */}
        <Text style={styles.saudacao}>Olá, User 👋</Text>
        <Text style={styles.saudacaoSub}>O que vamos rachar hoje?</Text>

        <View style={styles.cards}>
          <MenuCard
            Icon={IconUsers}
            label="Grupos"
            sub="Faculdade · Família · Trabalho"
            meta="4 grupos"
            onPress={() => router.push('/grupos')}
          />
          <MenuCard
            Icon={IconCalendar}
            label="Eventos"
            sub="Churrasco do sábado, Viagem RJ"
            meta="2 ativos"
            onPress={() => router.push('/eventos')}
          />
          <CotacaoCard onPress={() => router.push('/cotacao')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  marcaNome: {
    fontSize: 20,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Scroll
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  saudacao: {
    fontSize: 24,
    fontWeight: '800',
    color: INK,
    marginTop: Spacing.one,
  },
  saudacaoSub: {
    fontSize: 15,
    fontWeight: '600',
    color: MUTED,
    marginTop: 2,
  },
  cards: {
    gap: Spacing.three,
    marginTop: Spacing.four,
  },

  // Card padrão
  card: {
    backgroundColor: ORANGE_TINT,
    borderRadius: 20,
    padding: Spacing.three,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: '#FFE7D6',
  },
  cardGhost: {
    position: 'absolute',
    right: -18,
    top: -14,
    opacity: 0.14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexto: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: ORANGE_DARK,
  },
  cardSub: {
    fontSize: 13,
    color: ORANGE_DARK,
    opacity: 0.75,
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 13,
    fontWeight: '700',
    color: ORANGE,
    marginTop: Spacing.two,
  },

  // Card destaque (Cotação)
  cardCotacao: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    padding: Spacing.three,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  cardCotacaoPressed: {
    backgroundColor: ORANGE_DARK,
  },
  iconTileLight: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabelLight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  cardSubLight: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  cardMetaLight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    marginTop: Spacing.two,
  },
});
