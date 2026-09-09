-- ==============================================================================
-- ATELIER NICE — SUPABASE DATABASE SCHEMA, STORAGE & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://app.supabase.com/project/_/sql

-- 1. Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Categorias
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);

-- 3. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  promotional_price NUMERIC(10, 2),
  rental_price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2),
  modality VARCHAR(50) DEFAULT 'both', -- 'sale', 'rent', 'both'
  stock INTEGER DEFAULT 1,
  min_stock_alert INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'draft',  -- 'draft', 'published', 'hidden', 'archived', 'out_of_stock'
  featured BOOLEAN DEFAULT false,
  characteristics JSONB DEFAULT '{}'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  seo JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Produtos
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

-- 4. Tabela de Imagens de Produtos
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Imagens
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_cover ON public.product_images(is_cover);
CREATE INDEX IF NOT EXISTS idx_product_images_position ON public.product_images(position);

-- 5. Trigger para atualizar 'updated_at' automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 6. Configuração de Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" 
  ON public.categories FOR SELECT 
  USING (active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products" 
  ON public.products FOR SELECT 
  USING (status IN ('published', 'out_of_stock') OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" 
  ON public.product_images FOR SELECT 
  USING (true);

-- Políticas de Escrita para Usuários Autenticados (Admin)
DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
CREATE POLICY "Admin full access on categories" 
  ON public.categories FOR ALL 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access on products" ON public.products;
CREATE POLICY "Admin full access on products" 
  ON public.products FOR ALL 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access on product_images" ON public.product_images;
CREATE POLICY "Admin full access on product_images" 
  ON public.product_images FOR ALL 
  USING (auth.role() = 'authenticated');

-- 7. Configuração do Bucket de Storage (products)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para o Bucket 'products'
DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
CREATE POLICY "Public read products bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin upload to products bucket" ON storage.objects;
CREATE POLICY "Admin upload to products bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update products bucket" ON storage.objects;
CREATE POLICY "Admin update products bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete products bucket" ON storage.objects;
CREATE POLICY "Admin delete products bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- 8. Carga Inicial de Categorias (Se a tabela estiver vazia)
INSERT INTO public.categories (name, slug, description, image, active)
VALUES 
  ('Vestidos de Festa & Gala', 'festa-e-gala', 'Vestidos longos, fendas imponentes e tecidos nobres para formaturas, premiações e noites inesquecíveis.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', true),
  ('Madrinhas de Casamento', 'madrinhas', 'Modelagens fluidas e estruturadas em paletas harmônicas para altares sofisticados.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80', true),
  ('Noivas & Cerimônia Civil', 'noivas-e-civil', 'Linhas puras, rendas francesas e sofisticação atemporal para noivas modernas e cerimônias intimistas.', 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80', true),
  ('Formatura & Debutantes', 'formatura-debutantes', 'Criações exclusivas com presença marcante, corsets estruturados e brilho sob medida.', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (slug) DO NOTHING;
