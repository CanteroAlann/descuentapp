# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install --no-frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copiar solo dependencias de producción
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --no-frozen-lockfile && pnpm store prune

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "dist/index.js"]
