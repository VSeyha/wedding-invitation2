// POST /api/admin/couple/upload - Upload groom/bride portraits without adding to wedding_photos gallery
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = files[0]
  if (!file.filename || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file data' })
  }

  // Ensure storage bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = (buckets || []).some((b) => b.name === 'wedding-photos' || b.id === 'wedding-photos')
  if (!bucketExists) {
    await supabase.storage.createBucket('wedding-photos', {
      public: true,
      fileSizeLimit: 10485760
    })
  }

  const ext = file.filename.split('.').pop() || 'webp'
  const cleanName = file.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storagePath = `portraits/${Date.now()}_${cleanName}`

  // Upload to Supabase Storage in 'portraits/' directory
  const { error: uploadError } = await supabase.storage
    .from('wedding-photos')
    .upload(storagePath, file.data, {
      contentType: file.type || 'image/webp',
      upsert: true
    })

  if (uploadError) {
    console.error('Storage portrait upload error:', uploadError)
    throw createError({
      statusCode: 500,
      statusMessage: `Upload failed: ${uploadError.message}`
    })
  }

  const { data: urlData } = supabase.storage
    .from('wedding-photos')
    .getPublicUrl(storagePath)

  // Returns ONLY the public URL without touching wedding_photos gallery table!
  return {
    data: {
      url: urlData.publicUrl,
      storage_path: storagePath
    }
  }
})
