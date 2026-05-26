import {
  TabList,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';

const ORANGE = '#FF6B00';

export default function AppTabs() {
  return (
    <Tabs>
      <TabList asChild>
        <NavBar>
          <TabTrigger name="inicio" href="/inicio" asChild>
            <NavButton>Início</NavButton>
          </TabTrigger>
          <TabTrigger name="explorar" href="/explorar" asChild>
            <NavButton>Explorar</NavButton>
          </TabTrigger>
        </NavBar>
      </TabList>
      <TabSlot style={{ flex: 1 }} />
    </Tabs>
  );
}

function NavButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.navBtn, isFocused && styles.navBtnAtivo, pressed && styles.navBtnPressed]}>
      <Text style={[styles.navBtnTexto, isFocused && styles.navBtnTextoAtivo]}>
        {children}
      </Text>
    </Pressable>
  );
}

function NavBar({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBarInner}>
        <Text style={styles.marca}>Raxadinha</Text>
        <View style={styles.navLinks}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: ORANGE,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  navBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  marca: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 'auto',
  },
  navLinks: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  navBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  navBtnAtivo: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  navBtnPressed: {
    opacity: 0.7,
  },
  navBtnTexto: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '600',
  },
  navBtnTextoAtivo: {
    color: '#fff',
  },
});
