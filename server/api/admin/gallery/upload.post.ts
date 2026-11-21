// POST /api/admin/gallery/upload - Server-side upload using Service Role (bypasses storage RLS and auto-creates bucket if missing)
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  // Parse multipart form
  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
  }

  // Ensure storage bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = (buckets || []).some((b) => b.name === 'wedding-photos' || b.id === 'wedding-photos')
  if (!bucketExists) {
    await supabase.storage.createBucket('wedding-photos', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    })
  }

  const uploadedPhotos = []

  // Count existing photos to get display_order base
  const { count } = await supabase
    .from('wedding_photos')
    .select('id', { count: 'exact', head: true })

  let currentOrder = count || 0

  for (const file of files) {
    if (!file.filename || !file.data) continue

    const ext = file.filename.split('.').pop() || 'jpg'
    const cleanName = file.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `photos/${Date.now()}_${cleanName}`

    // Upload to Supabase Storage using service role
    const { error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(storagePath, file.data, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw createError({
        statusCode: 500,
        statusMessage: `Storage upload failed: ${uploadError.message}`
      })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    // Insert database record (populating both column variants: storage_path & photo_url)
    const orderIndex = currentOrder++
    let { data: photoRecord, error: dbError } = await supabase
      .from('wedding_photos')
      .insert({
        storage_path: storagePath,
        photo_url: publicUrl,
        alt_text_en: file.filename,
        caption_en: file.filename,
        display_order: orderIndex
      })
      .select()
      .single()

    // If insert fails due to column constraints (e.g. alt_text_en vs caption_en), retry with universal fallback
    if (dbError) {
      console.warn('First insert attempt failed, trying fallback insert:', dbError.message)
      const fallbackResult = await supabase
        .from('wedding_photos')
        .insert({
          photo_url: publicUrl,
          storage_path: storagePath,
          display_order: orderIndex
        })
        .select()
        .single()

      photoRecord = fallbackResult.data
      dbError = fallbackResult.error
    }

    if (dbError) {
      console.error('DB insert error:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: `Database record failed: ${dbError.message}`
      })
    }

    uploadedPhotos.push({
      ...photoRecord,
      url: publicUrl
    })
  }

  return { data: uploadedPhotos }
})
