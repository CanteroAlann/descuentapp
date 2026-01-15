/**
 * @module discounts/presentation/screens
 * @description Pantalla principal de descuentos.
 * Compone los componentes de presentación y maneja la navegación.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscountList } from '../components/DiscountList';
import type { Discount } from '../../domain';

interface DiscountsScreenProps {
  onDiscountPress?: (discount: Discount) => void;
}

/**
 * Header de la pantalla de descuentos
 */
const DiscountsHeader: React.FC = () => (
  <View className="px-4 pb-4">
    <Text className="text-2xl font-bold text-foreground mb-1">
      Descuentos
    </Text>
    <Text className="text-muted">
      Encuentra las mejores ofertas cerca de ti
    </Text>
  </View>
);

/**
 * Pantalla DiscountsScreen - Lista todos los descuentos disponibles
 * 
 * @example
 * ```tsx
 * // En el navigator
 * <Stack.Screen name="Discounts" component={DiscountsScreen} />
 * ```
 */
export const DiscountsScreen: React.FC<DiscountsScreenProps> = ({
  onDiscountPress,
}) => {
  const handleDiscountPress = (discount: Discount) => {
    // TODO: Navegar a detalle del descuento
    console.log('Discount pressed:', discount.id);
    onDiscountPress?.(discount);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DiscountList
        filters={{ onlyActive: true }}
        onDiscountPress={handleDiscountPress}
        ListHeaderComponent={<DiscountsHeader />}
      />
    </SafeAreaView>
  );
};

export default DiscountsScreen;
