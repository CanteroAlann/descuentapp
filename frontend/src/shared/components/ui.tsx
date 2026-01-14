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
  type ViewStyle 
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
  color = '#6366f1',
  text,
  testID = 'loading-spinner',
}) => (
  <View testID={testID} className="flex-1 justify-center items-center">
    <ActivityIndicator size={size} color={color} />
    {text && (
      <Text className="text-gray-500 mt-3 text-base">{text}</Text>
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
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-gray-200 active:bg-gray-300',
  outline: 'bg-transparent border-2 border-primary-500 active:bg-primary-50',
  ghost: 'bg-transparent active:bg-gray-100',
};

const textVariants = {
  primary: 'text-white',
  secondary: 'text-gray-900',
  outline: 'text-primary-500',
  ghost: 'text-primary-500',
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
        color={variant === 'primary' ? '#fff' : '#6366f1'} 
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
  <View testID={testID} className="flex-1 justify-center items-center px-8 py-12">
    <Text className="text-5xl mb-4">{emoji}</Text>
    <Text className="text-gray-900 font-semibold text-lg text-center mb-2">
      {title}
    </Text>
    {description && (
      <Text className="text-gray-500 text-center mb-6">
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
  <View testID={testID} className="flex-1 justify-center items-center px-8 py-12">
    <Text className="text-5xl mb-4">😕</Text>
    <Text className="text-gray-900 font-semibold text-lg text-center mb-2">
      Error
    </Text>
    <Text className="text-gray-500 text-center mb-6">
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
  <View className={`h-px bg-gray-200 ${className}`} />
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
  primary: 'bg-primary-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  error: 'bg-red-100',
  gray: 'bg-gray-100',
};

const badgeTextVariants = {
  primary: 'text-primary-700',
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  gray: 'text-gray-700',
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
