/**
 * @module discounts/tests
 * @description Tests unitarios para el repositorio de descuentos.
 * Verifica la validación con Zod y el mapeo de DTOs al dominio.
 */
import { createDiscountRepository } from '../data/repositories/user.repository';
import { DiscountDTOSchema } from '../data/schemas/discount.schema';
import type { IDiscountRepository } from '../domain/interfaces/discount.interface';
import type { DiscountDTO } from '../data/schemas/discount.schema';

describe('DiscountRepository', () => {
  let repository: IDiscountRepository;
  let mockHttpClient: {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
  };

  // Datos de prueba válidos
  const mockDiscountDTO: DiscountDTO = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: '50% en Pizza',
    description: 'Descuento en todas las pizzas grandes',
    discountPercentage: 50,
    storeName: 'Pizza Palace',
    validUntil: '2025-12-31T23:59:59.000Z',
    isActive: true,
    latitude: -34.6037,
    longitude: -58.3816,
  };

  const mockDiscountsResponse: DiscountDTO[] = [
    mockDiscountDTO,
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: '30% en Hamburguesas',
      description: 'Válido solo los martes',
      discountPercentage: 30,
      storeName: 'Burger House',
      validUntil: '2025-06-30T23:59:59.000Z',
      isActive: true,
      latitude: null,
      longitude: null,
    },
  ];

  beforeEach(() => {
    // Crear mock del cliente HTTP
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    repository = createDiscountRepository(mockHttpClient as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería obtener todos los descuentos correctamente', async () => {
      // Arrange
      mockHttpClient.get.mockResolvedValueOnce({ data: mockDiscountsResponse });

      // Act
      const result = await repository.getAll();

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith('/discounts');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockDiscountDTO.id);
      expect(result[0].title).toBe(mockDiscountDTO.title);
      expect(result[0].validUntil).toBeInstanceOf(Date);
    });

    it('debería aplicar filtros correctamente', async () => {
      // Arrange
      mockHttpClient.get.mockResolvedValueOnce({ data: [] });

      // Act
      await repository.getAll({ 
        onlyActive: true, 
        minDiscountPercentage: 20,
        storeNameContains: 'Pizza' 
      });

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('onlyActive=true')
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('minDiscount=20')
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('store=Pizza')
      );
    });

    it('debería mapear ubicación solo cuando hay coordenadas válidas', async () => {
      // Arrange
      mockHttpClient.get.mockResolvedValueOnce({ data: mockDiscountsResponse });

      // Act
      const result = await repository.getAll();

      // Assert
      // Primer descuento tiene coordenadas
      expect(result[0].location).toEqual({
        latitude: -34.6037,
        longitude: -58.3816,
      });
      // Segundo descuento no tiene coordenadas
      expect(result[1].location).toBeUndefined();
    });

    it('debería lanzar error si la respuesta no es válida', async () => {
      // Arrange
      const invalidResponse = [{ invalid: 'data' }];
      mockHttpClient.get.mockResolvedValueOnce({ data: invalidResponse });

      // Act & Assert
      await expect(repository.getAll()).rejects.toThrow();
    });

    it('debería lanzar error si validUntil no es fecha válida', async () => {
      // Arrange
      const invalidDate = [{ ...mockDiscountDTO, validUntil: 'invalid-date' }];
      mockHttpClient.get.mockResolvedValueOnce({ data: invalidDate });

      // Act & Assert
      await expect(repository.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('debería obtener un descuento por ID', async () => {
      // Arrange
      const discountId = mockDiscountDTO.id;
      mockHttpClient.get.mockResolvedValueOnce({ data: mockDiscountDTO });

      // Act
      const result = await repository.getById(discountId);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/discounts/${discountId}`);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(discountId);
    });

    it('debería retornar null si el descuento no existe (404)', async () => {
      // Arrange
      const error = {
        response: { status: 404 },
        isAxiosError: true,
      };
      mockHttpClient.get.mockRejectedValueOnce(error);

      // Act
      const result = await repository.getById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });

    it('debería propagar otros errores', async () => {
      // Arrange
      const error = {
        response: { status: 500 },
        isAxiosError: true,
      };
      mockHttpClient.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(repository.getById('some-id')).rejects.toEqual(error);
    });
  });

  describe('getNearby', () => {
    it('debería buscar descuentos cercanos con parámetros correctos', async () => {
      // Arrange
      const location = { latitude: -34.6037, longitude: -58.3816 };
      const radius = 5;
      mockHttpClient.get.mockResolvedValueOnce({ data: [mockDiscountDTO] });

      // Act
      const result = await repository.getNearby(location, radius);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/discounts/nearby')
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('lat=-34.6037')
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('lng=-58.3816')
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('radius=5')
      );
      expect(result).toHaveLength(1);
    });
  });
});

describe('DiscountDTO Validation (Zod)', () => {
  it('debería validar un DTO correcto', () => {
    const validDTO = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Discount',
      description: 'Description',
      discountPercentage: 25,
      storeName: 'Test Store',
      validUntil: '2025-12-31T23:59:59.000Z',
      isActive: true,
      latitude: -34.6,
      longitude: -58.3,
    };

    expect(() => DiscountDTOSchema.parse(validDTO)).not.toThrow();
  });

  it('debería rechazar UUID inválido', () => {
    const invalidDTO = {
      id: 'not-a-uuid',
      title: 'Test',
      description: 'Desc',
      discountPercentage: 10,
      storeName: 'Store',
      validUntil: '2025-12-31T23:59:59.000Z',
      isActive: true,
    };

    expect(() => DiscountDTOSchema.parse(invalidDTO)).toThrow();
  });

  it('debería rechazar porcentaje fuera de rango', () => {
    const invalidDTO = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test',
      description: 'Desc',
      discountPercentage: 150, // > 100
      storeName: 'Store',
      validUntil: '2025-12-31T23:59:59.000Z',
      isActive: true,
    };

    expect(() => DiscountDTOSchema.parse(invalidDTO)).toThrow();
  });

  it('debería rechazar título vacío', () => {
    const invalidDTO = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: '', // vacío
      description: 'Desc',
      discountPercentage: 10,
      storeName: 'Store',
      validUntil: '2025-12-31T23:59:59.000Z',
      isActive: true,
    };

    expect(() => DiscountDTOSchema.parse(invalidDTO)).toThrow();
  });

  it('debería aceptar coordenadas null', () => {
    const dtoWithNullCoords = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test',
      description: 'Desc',
      discountPercentage: 10,
      storeName: 'Store',
      validUntil: '2025-12-31T23:59:59.000Z',
      isActive: true,
      latitude: null,
      longitude: null,
    };

    expect(() => DiscountDTOSchema.parse(dtoWithNullCoords)).not.toThrow();
  });
});
