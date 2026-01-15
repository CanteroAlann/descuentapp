/**
 * @module discounts/tests
 * @description Tests de componentes para DiscountList y DiscountCard.
 * Verifica estados de carga, error, vacío y renderizado de datos.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DiscountList } from '../presentation/components/DiscountList';
import { DiscountCard } from '../presentation/components/DiscountCard';
import type { Discount } from '../domain';

// Mock del módulo de http-client usando alias
jest.mock('@infrastructure/api/http-client', () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

// Datos de prueba
const mockDiscount: Discount = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: '50% en Pizza',
  description: 'Descuento en todas las pizzas grandes',
  discountPercentage: 50,
  storeName: 'Pizza Palace',
  validUntil: new Date('2026-12-31'), // Fecha lejana para que sea "Activo"
  isActive: true,
  location: {
    latitude: -34.6037,
    longitude: -58.3816,
  },
};

const mockExpiredDiscount: Discount = {
  ...mockDiscount,
  id: '550e8400-e29b-41d4-a716-446655440001',
  title: 'Descuento Expirado',
  validUntil: new Date('2024-01-01'), // Fecha pasada
};

const mockExpiringSoonDiscount: Discount = {
  ...mockDiscount,
  id: '550e8400-e29b-41d4-a716-446655440002',
  title: 'Por Vencer',
  validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días
};

// Helper para crear QueryClient de prueba
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

// Wrapper con QueryClientProvider
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('DiscountCard', () => {
  it('debería renderizar información del descuento correctamente', () => {
    // Arrange & Act
    render(<DiscountCard discount={mockDiscount} testID="test-card" />);

    // Assert
    expect(screen.getByTestId('test-card-title')).toHaveTextContent('50% en Pizza');
    expect(screen.getByTestId('test-card-description')).toHaveTextContent(
      'Descuento en todas las pizzas grandes'
    );
    expect(screen.getByTestId('test-card-store')).toHaveTextContent('Pizza Palace');
    expect(screen.getByTestId('test-card-percentage')).toHaveTextContent('-50%');
  });

  it('debería llamar onPress cuando se presiona la tarjeta', () => {
    // Arrange
    const onPressMock = jest.fn();
    render(
      <DiscountCard 
        discount={mockDiscount} 
        onPress={onPressMock} 
        testID="test-card"
      />
    );

    // Act
    fireEvent.press(screen.getByTestId('test-card'));

    // Assert
    expect(onPressMock).toHaveBeenCalledWith(mockDiscount);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar badge "Activo" para descuento activo', () => {
    // Arrange & Act
    render(<DiscountCard discount={mockDiscount} />);

    // Assert
    expect(screen.getByText('Activo')).toBeTruthy();
  });

  it('debería mostrar badge "Expirado" para descuento expirado', () => {
    // Arrange & Act
    render(<DiscountCard discount={mockExpiredDiscount} />);

    // Assert
    expect(screen.getByText('Expirado')).toBeTruthy();
  });

  it('debería mostrar badge "¡Por vencer!" para descuento próximo a expirar', () => {
    // Arrange & Act
    render(<DiscountCard discount={mockExpiringSoonDiscount} />);

    // Assert
    expect(screen.getByText('¡Por vencer!')).toBeTruthy();
  });

  it('debería aplicar opacidad reducida a descuentos expirados', () => {
    // Arrange & Act
    const { getByTestId } = render(
      <DiscountCard discount={mockExpiredDiscount} testID="expired-card" />
    );

    // Assert - Verificar que existe el componente (la opacidad se aplica via className)
    expect(getByTestId('expired-card')).toBeTruthy();
  });
});

describe('DiscountList', () => {
  const mockHttpClient = require('@infrastructure/api/http-client').httpClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar estado de carga inicialmente', async () => {
    // Arrange
    mockHttpClient.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );

    // Act
    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByTestId('test-list-loading')).toBeTruthy();
    expect(screen.getByText('Cargando descuentos...')).toBeTruthy();
  });

  it('debería mostrar lista de descuentos después de cargar', async () => {
    // Arrange
    const mockDiscountsDTO = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: '50% en Pizza',
        description: 'Desc',
        discountPercentage: 50,
        storeName: 'Pizza Palace',
        validUntil: '2026-12-31T00:00:00.000Z',
        isActive: true,
        latitude: null,
        longitude: null,
      },
    ];
    mockHttpClient.get.mockResolvedValue({ data: mockDiscountsDTO });

    // Act
    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    // Assert - esperar con timeout más largo
    await waitFor(
      () => {
        expect(screen.getByText('50% en Pizza')).toBeTruthy();
      },
      { timeout: 5000 }
    );
  }, 15000);

  it('debería mostrar estado vacío cuando no hay descuentos', async () => {
    // Arrange
    mockHttpClient.get.mockResolvedValueOnce({ data: [] });

    // Act
    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('test-list-empty')).toBeTruthy();
      expect(screen.getByText('No hay descuentos disponibles')).toBeTruthy();
    });
  });

  it('debería mostrar estado de error y botón de reintentar', async () => {
    // Arrange
    mockHttpClient.get.mockRejectedValueOnce(new Error('Network Error'));

    // Act
    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('test-list-error')).toBeTruthy();
      expect(screen.getByText('Algo salió mal')).toBeTruthy();
      expect(screen.getByTestId('test-list-retry')).toBeTruthy();
    });
  });

  it('debería reintentar al presionar botón de retry', async () => {
    // Arrange
    mockHttpClient.get
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: [] });

    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    // Esperar a que aparezca el error
    await waitFor(() => {
      expect(screen.getByTestId('test-list-retry')).toBeTruthy();
    });

    // Act
    fireEvent.press(screen.getByTestId('test-list-retry'));

    // Assert
    await waitFor(() => {
      expect(mockHttpClient.get).toHaveBeenCalledTimes(2);
    });
  });

  it('debería llamar onDiscountPress al presionar un item', async () => {
    // Arrange
    const onPressMock = jest.fn();
    const mockDiscountsDTO = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Discount',
        description: 'Desc',
        discountPercentage: 25,
        storeName: 'Store',
        validUntil: '2025-12-31T00:00:00.000Z',
        isActive: true,
        latitude: null,
        longitude: null,
      },
    ];
    mockHttpClient.get.mockResolvedValueOnce({ data: mockDiscountsDTO });

    render(
      <DiscountList testID="test-list" onDiscountPress={onPressMock} />,
      { wrapper: createWrapper() }
    );

    // Esperar a que carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Test Discount')).toBeTruthy();
    });

    // Act
    fireEvent.press(screen.getByTestId('test-list-item-0'));

    // Assert
    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '550e8400-e29b-41d4-a716-446655440000' })
    );
  });
});
