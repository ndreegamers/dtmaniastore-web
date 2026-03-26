import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  theme?: Theme;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  theme = lightTheme,
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderLight,
          borderRadius: theme.borderRadius.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});
