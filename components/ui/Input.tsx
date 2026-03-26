import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  theme?: Theme;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  placeholder,
  theme = lightTheme,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? theme.colors.error : theme.colors.text,
              fontFamily: theme.fonts.bodyMedium,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor,
            borderRadius: theme.borderRadius.md,
            fontFamily: theme.fonts.body,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: theme.colors.error,
              fontFamily: theme.fonts.body,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1.5,
    minHeight: 48,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
