/**
 * @module shared/components
 * @description Componentes de UI reutilizables (UI Kit).
 */
import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Pressable, 
  TextInput,
  type ViewStyle,
  type TextInputProps,
} from 'react-native';

// ============================================================================
// Loading
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  testID = 'loading-spinner',
}) => (
  <View testID={testID} className="flex-1 justify-center items-center bg-background">
    <ActivityIndicator size={size} color={color ?? 'hsl(239, 84%, 67%)'} />
    {text && (
      <Text className="text-muted mt-3 text-base">{text}</Text>
    )}
  </View>
);

// ============================================================================
// Buttons
// ============================================================================

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  style?: ViewStyle;
}

const buttonVariants = {
  primary: 'bg-primary active:bg-primary/80',
  secondary: 'bg-card active:bg-card/80',
  outline: 'bg-transparent border-2 border-primary active:bg-primary/10',
  ghost: 'bg-transparent active:bg-card',
};

const textVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  outline: 'text-primary',
  ghost: 'text-primary',
};

const sizeVariants = {
  sm: 'px-3 py-2',
  md: 'px-5 py-3',
  lg: 'px-8 py-4',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  testID = 'button',
  style,
}) => (
  <Pressable
    testID={testID}
    onPress={onPress}
    disabled={disabled || loading}
    className={`
      rounded-xl items-center justify-center flex-row
      ${buttonVariants[variant]}
      ${sizeVariants[size]}
      ${disabled ? 'opacity-50' : ''}
    `}
    style={style}
  >
    {loading ? (
      <ActivityIndicator 
        size="small" 
        color={variant === 'primary' ? 'hsl(0, 0%, 100%)' : 'hsl(239, 84%, 67%)'} 
      />
    ) : (
      <Text 
        className={`font-semibold ${textVariants[variant]} ${textSizes[size]}`}
      >
        {title}
      </Text>
    )}
  </Pressable>
);

// ============================================================================
// Empty States
// ============================================================================

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '📭',
  title,
  description,
  actionText,
  onAction,
  testID = 'empty-state',
}) => (
  <View testID={testID} className="flex-1 justify-center items-center px-8 py-12 bg-background">
    <Text className="text-5xl mb-4">{emoji}</Text>
    <Text className="text-foreground font-semibold text-lg text-center mb-2">
      {title}
    </Text>
    {description && (
      <Text className="text-muted text-center mb-6">
        {description}
      </Text>
    )}
    {actionText && onAction && (
      <Button
        title={actionText}
        onPress={onAction}
        variant="primary"
        size="md"
      />
    )}
  </View>
);

// ============================================================================
// Error States
// ============================================================================

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  testID?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Algo salió mal. Intenta de nuevo.',
  onRetry,
  testID = 'error-state',
}) => (
  <View testID={testID} className="flex-1 justify-center items-center px-8 py-12 bg-background">
    <Text className="text-5xl mb-4">😕</Text>
    <Text className="text-foreground font-semibold text-lg text-center mb-2">
      Error
    </Text>
    <Text className="text-muted text-center mb-6">
      {message}
    </Text>
    {onRetry && (
      <Button
        title="Reintentar"
        onPress={onRetry}
        variant="primary"
        size="md"
        testID={`${testID}-retry`}
      />
    )}
  </View>
);

// ============================================================================
// Divider
// ============================================================================

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => (
  <View className={`h-px bg-border ${className}`} />
);

// ============================================================================
// Badge
// ============================================================================

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
  testID?: string;
}

const badgeVariants = {
  primary: 'bg-primary/20',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  error: 'bg-red-100',
  gray: 'bg-card',
};

const badgeTextVariants = {
  primary: 'text-primary',
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  gray: 'text-muted',
};

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  testID = 'badge',
}) => (
  <View 
    testID={testID}
    className={`rounded-full px-3 py-1 ${badgeVariants[variant]}`}
  >
    <Text className={`text-xs font-medium ${badgeTextVariants[variant]}`}>
      {text}
    </Text>
  </View>
);

// ============================================================================
// Card
// ============================================================================

interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  style,
  testID = 'card',
}) => (
  <View
    testID={testID}
    style={style}
    className="bg-card border border-border rounded-2xl p-4"
  >
    {title && (
      <Text className="text-card-foreground font-semibold text-lg">
        {title}
      </Text>
    )}

    {description && (
      <Text className="text-muted mt-1">
        {description}
      </Text>
    )}

    {children}
  </View>
);

// ============================================================================
// Input
// ============================================================================

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  testID = 'input',
  ...textInputProps
}) => (
  <View style={containerStyle} testID={`${testID}-container`}>
    {label && (
      <Text className="text-foreground font-medium text-sm mb-2">
        {label}
      </Text>
    )}
    <TextInput
      testID={testID}
      className={`
        bg-card border rounded-xl px-4 py-3
        text-foreground text-base
        ${error ? 'border-red-500' : 'border-border'}
      `}
      placeholderTextColor="hsl(240, 5%, 45%)"
      {...textInputProps}
    />
    {error && (
      <Text className="text-red-500 text-sm mt-1" testID={`${testID}-error`}>
        {error}
      </Text>
    )}
  </View>
);
