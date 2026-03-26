import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  theme?: Theme;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  style,
  theme = lightTheme,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as any,
          height,
          borderRadius: borderRadius ?? theme.borderRadius.sm,
          backgroundColor: theme.colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ─── Preset compositions ─────────────────────────────────────────────────────

interface SkeletonCardProps {
  theme?: Theme;
}

export const SkeletonProductCard: React.FC<SkeletonCardProps> = ({ theme = lightTheme }) => (
  <View
    style={[
      skStyles.card,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.borderRadius.lg,
      },
    ]}
  >
    {/* Image area */}
    <Skeleton width="100%" height={160} borderRadius={0} theme={theme} />
    {/* Text rows */}
    <View style={skStyles.cardContent}>
      <Skeleton width="85%" height={13} theme={theme} />
      <Skeleton width="60%" height={13} theme={theme} />
      <Skeleton width="40%" height={18} theme={theme} />
    </View>
  </View>
);

export const SkeletonCategoryCard: React.FC<SkeletonCardProps> = ({ theme = lightTheme }) => (
  <View
    style={[
      skStyles.catCard,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.borderRadius.lg,
      },
    ]}
  >
    <Skeleton width="100%" height={100} borderRadius={theme.borderRadius.md} theme={theme} />
    <Skeleton width="70%" height={12} theme={theme} style={{ alignSelf: 'center' }} />
  </View>
);

export const SkeletonHero: React.FC<SkeletonCardProps> = ({ theme = lightTheme }) => (
  <Skeleton width="100%" height={320} borderRadius={0} theme={theme} />
);

const styles = StyleSheet.create({
  base: {},
});

const skStyles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden', gap: 0 },
  cardContent: { padding: 12, gap: 8 },
  catCard: { borderWidth: 1, padding: 12, alignItems: 'center', gap: 10 },
});
