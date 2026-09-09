/**
 * ATELIER NICE — CLIENT-SIDE IMAGE OPTIMIZER
 * Resizes, compresses and converts uploaded photos to WebP before sending to Supabase Storage.
 */

export const OPTIMIZATION_DEFAULTS = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.84, // Optimal balance for luxury couture fabric texture and high performance
  maxFileSizeBytes: 15 * 1024 * 1024 // 15MB initial upload limit before compression
};

/**
 * Optimizes an image File/Blob in the browser using HTML5 Canvas.
 * @param {File|Blob} file 
 * @param {Object} options 
 * @returns {Promise<{ file: File, blob: Blob, previewUrl: string, originalSize: number, optimizedSize: number, width: number, height: number }>}
 */
export const optimizeImage = async (file, options = {}) => {
  const config = { ...OPTIMIZATION_DEFAULTS, ...options };

  if (!file) {
    throw new Error('Nenhum arquivo de imagem fornecido.');
  }

  // Validate original size
  if (file.size > config.maxFileSizeBytes) {
    throw new Error(`A imagem excede o tamanho máximo de ${Math.round(config.maxFileSizeBytes / 1024 / 1024)}MB.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional dimensions
        if (width > config.maxWidth || height > config.maxHeight) {
          if (width / height > config.maxWidth / config.maxHeight) {
            height = Math.round((height * config.maxWidth) / width);
            width = config.maxWidth;
          } else {
            width = Math.round((width * config.maxHeight) / height);
            height = config.maxHeight;
          }
        }

        // Create Canvas for hardware-accelerated rasterization
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Não foi possível inicializar o contexto gráfico no navegador.'));
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao processar conversão para formato WebP.'));
              return;
            }

            // Create clean WebP file with standard naming
            const originalName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'atelier-foto';
            const safeName = `${originalName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}.webp`;
            
            const optimizedFile = new File([blob], safeName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: optimizedFile,
              blob,
              previewUrl,
              originalSize: file.size,
              optimizedSize: blob.size,
              width,
              height,
              compressionRatio: ((1 - blob.size / file.size) * 100).toFixed(1)
            });
          },
          'image/webp',
          config.quality
        );
      };

      img.onerror = () => {
        reject(new Error('Falha ao carregar a imagem. Verifique se o arquivo é um formato válido.'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Falha ao ler o arquivo de imagem no dispositivo.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable string (e.g. 1.2 MB, 450 KB)
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
