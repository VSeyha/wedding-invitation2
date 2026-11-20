export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: 'image/webp' | 'image/jpeg'
}

/**
 * Compresses and resizes an image client-side using an HTML5 Canvas before uploading.
 * Drops typical phone photos from 5MB-15MB down to ~150KB-350KB while retaining
 * crystal-clear visual quality on Retina and mobile screens.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    mimeType = 'image/webp'
  } = options

  // Don't process non-image files or SVG
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate proportional scale factor
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(file)
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file)
            }

            // Only use compressed blob if it's actually smaller than the original
            if (blob.size < file.size) {
              const ext = mimeType === 'image/webp' ? '.webp' : '.jpg'
              const baseName = file.name.replace(/\.[^/.]+$/, '')
              const compressedFile = new File([blob], `${baseName}${ext}`, {
                type: mimeType,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          mimeType,
          quality
        )
      }

      img.onerror = () => resolve(file)
      img.src = e.target?.result as string
    }

    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
