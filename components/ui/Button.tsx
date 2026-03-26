import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  theme?: Theme;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  theme = lightTheme,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    { borderRadius: theme.borderRadius.md },
  ];

  const labelStyles: TextStyle[] = [
    styles.label,
    { fontFamily: theme.fonts.bodyMedium },
  ];

  switch (variant) {
    case 'primary':
      containerStyles.push({
        backgroundColor: isDisabled ? theme.colors.textMuted : theme.colors.primary,
      });
      labelStyles.push({ color: '#FFFFFF' });
      break;
    case 'secondary':
      containerStyles.push({
        backgroundColor: isDisabled ? theme.colors.borderLight : theme.colors.surface,
      });
      labelStyles.push({
        color: isDisabled ? theme.colors.textMuted : theme.colors.text,
      });
      break;
    case 'outline':
      containerStyles.push({
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
      });
      labelStyles.push({
        color: isDisabled ? theme.colors.textMuted : theme.colors.primary,
      });
      break;
  }

  if (style) containerStyles.push(style);
  if (textStyle) labelStyles.push(textStyle);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary}
        />
      ) : (
        <Text style={labelStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  label: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
