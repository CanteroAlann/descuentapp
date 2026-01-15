/**
 * @module discounts/presentation/components
 * @description Lista de descuentos con estados de carga, error y vacío.
 * Integra TanStack Query a través del hook useDiscounts.
 */
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  Pressable 
} from 'react-native';
import type { Discount, DiscountFilters } from '../../domain';
import { useDiscounts } from '../hooks/use-discounts';
import { DiscountCard } from './DiscountCard';

interface DiscountListProps {
  filters?: DiscountFilters;
  onDiscountPress?: (discount: Discount) => void;
  testID?: string;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

/**
 * Componente de estado de carga
 */
const LoadingState: React.FC<{ testID?: string }> = ({ testID }) => (
  <View 
    testID={`${testID}-loading`}
    className="flex-1 justify-center items-center py-20 bg-background"
  >
    <ActivityIndicator size="large" color="hsl(239, 84%, 67%)" />
    <Text className="text-muted mt-4 text-base">
      Cargando descuentos...
    </Text>
  </View>
);

/**
 * Componente de estado de error
 */
const ErrorState: React.FC<{ 
  error: Error; 
  onRetry: () => void;
  testID?: string;
}> = ({ error, onRetry, testID }) => (
  <View 
    testID={`${testID}-error`}
    className="flex-1 justify-center items-center py-20 px-6 bg-background"
  >
    <Text className="text-5xl mb-4">😕</Text>
    <Text className="text-foreground font-semibold text-lg text-center mb-2">
      Algo salió mal
    </Text>
    <Text className="text-muted text-center mb-6">
      {error.message || 'No pudimos cargar los descuentos'}
    </Text>
    <Pressable
      testID={`${testID}-retry`}
      onPress={onRetry}
      className="bg-primary px-6 py-3 rounded-full active:bg-primary/80"
    >
      <Text className="text-primary-foreground font-semibold">Reintentar</Text>
    </Pressable>
  </View>
);

/**
 * Componente de estado vacío
 */
const EmptyState: React.FC<{ testID?: string }> = ({ testID }) => (
  <View 
    testID={`${testID}-empty`}
    className="flex-1 justify-center items-center py-20 px-6 bg-background"
  >
    <Text className="text-5xl mb-4">🏷️</Text>
    <Text className="text-foreground font-semibold text-lg text-center mb-2">
      No hay descuentos disponibles
    </Text>
    <Text className="text-muted text-center">
      Pronto aparecerán nuevas ofertas. ¡Vuelve más tarde!
    </Text>
  </View>
);

/**
 * Componente DiscountList - Lista de descuentos con manejo de estados
 * Usa TanStack Query internamente a través del hook useDiscounts.
 * 
 * @example
 * ```tsx
 * <DiscountList 
 *   filters={{ onlyActive: true }}
 *   onDiscountPress={(d) => navigation.navigate('Detail', { id: d.id })}
 * />
 * ```
 */
export const DiscountList: React.FC<DiscountListProps> = ({
  filters,
  onDiscountPress,
  testID = 'discount-list',
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const { 
    data: discounts, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useDiscounts(filters);

  // Estado de carga inicial
  if (isLoading) {
    return <LoadingState testID={testID} />;
  }

  // Estado de error
  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={() => refetch()} 
        testID={testID}
      />
    );
  }

  // Componente vacío personalizable
  const renderEmptyComponent = () => {
    if (ListEmptyComponent) return ListEmptyComponent;
    return <EmptyState testID={testID} />;
  };

  return (
    <FlatList<Discount>
      testID={testID}
      data={discounts ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <DiscountCard
          discount={item}
          onPress={onDiscountPress}
          testID={`${testID}-item-${index}`}
        />
      )}
      contentContainerStyle={{ 
        paddingTop: 16,
        paddingBottom: 32,
        flexGrow: 1,
      }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmptyComponent()}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          colors={['#6366f1']}
          tintColor="#6366f1"
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DiscountList;
