/**
 * @module discounts/presentation/components
 * @description Componente visual para mostrar un item de descuento.
 * Estilizado con NativeWind (Tailwind CSS para React Native).
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Discount } from '../../domain';

interface DiscountCardProps {
  discount: Discount;
  onPress?: (discount: Discount) => void;
  testID?: string;
}

/**
 * Formatea la fecha de vencimiento de forma legible
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Determina si el descuento está próximo a vencer (menos de 3 días)
 */
const isExpiringSoon = (validUntil: Date): boolean => {
  const now = new Date();
  const diffTime = validUntil.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 3 && diffDays > 0;
};

/**
 * Determina si el descuento ya expiró
 */
const isExpired = (validUntil: Date): boolean => {
  return validUntil < new Date();
};

/**
 * Componente DiscountCard - Tarjeta visual de un descuento
 * 
 * @example
 * ```tsx
 * <DiscountCard 
 *   discount={discount} 
 *   onPress={(d) => navigation.navigate('DiscountDetail', { id: d.id })}
 * />
 * ```
 */
export const DiscountCard: React.FC<DiscountCardProps> = ({ 
  discount, 
  onPress,
  testID = 'discount-card'
}) => {
  const expired = isExpired(discount.validUntil);
  const expiringSoon = !expired && isExpiringSoon(discount.validUntil);

  return (
    <Pressable
      testID={testID}
      onPress={() => onPress?.(discount)}
      className={`
        bg-card rounded-2xl p-4 mb-3 mx-4
        shadow-sm border border-border
        ${expired ? 'opacity-60' : ''}
        active:scale-[0.98] active:bg-card/80
      `}
    >
      {/* Header: Porcentaje y Estado */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="bg-primary rounded-full px-3 py-1">
          <Text 
            testID={`${testID}-percentage`}
            className="text-primary-foreground font-bold text-lg"
          >
            -{discount.discountPercentage}%
          </Text>
        </View>
        
        {expiringSoon && (
          <View className="bg-amber-100 rounded-full px-2 py-1">
            <Text className="text-amber-700 text-xs font-medium">
              ¡Por vencer!
            </Text>
          </View>
        )}
        
        {expired && (
          <View className="bg-red-100 rounded-full px-2 py-1">
            <Text className="text-red-700 text-xs font-medium">
              Expirado
            </Text>
          </View>
        )}
        
        {!expired && !expiringSoon && discount.isActive && (
          <View className="bg-green-100 rounded-full px-2 py-1">
            <Text className="text-green-700 text-xs font-medium">
              Activo
            </Text>
          </View>
        )}
      </View>

      {/* Título */}
      <Text 
        testID={`${testID}-title`}
        className="text-card-foreground font-semibold text-base mb-1"
        numberOfLines={2}
      >
        {discount.title}
      </Text>

      {/* Descripción */}
      <Text 
        testID={`${testID}-description`}
        className="text-muted text-sm mb-3"
        numberOfLines={2}
      >
        {discount.description}
      </Text>

      {/* Footer: Tienda y Fecha */}
      <View className="flex-row justify-between items-center pt-2 border-t border-border">
        <View className="flex-row items-center">
          <View className="w-6 h-6 bg-border rounded-full mr-2" />
          <Text 
            testID={`${testID}-store`}
            className="text-foreground font-medium text-sm"
          >
            {discount.storeName}
          </Text>
        </View>
        
        <Text 
          testID={`${testID}-validity`}
          className={`text-xs ${expired ? 'text-red-500' : 'text-muted'}`}
        >
          {expired ? 'Venció: ' : 'Hasta: '}
          {formatDate(discount.validUntil)}
        </Text>
      </View>
    </Pressable>
  );
};

export default DiscountCard;
