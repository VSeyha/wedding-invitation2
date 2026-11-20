import { createClient } from '@supabase/supabase-js'

const baseUrl = 'http://localhost:3000'

async function runTests() {
  console.log('🚀 Starting Automated End-to-End System Tests...\n')
  let passed = 0
  let failed = 0

  const assert = (condition: boolean, msg: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${msg}`)
      failed++
    }
  }

  // 1. Check Public APIs
  console.log('--- 1. Testing Public APIs ---')
  try {
    const resWedding = await fetch(`${baseUrl}/api/wedding`).then(r => r.json())
    assert(resWedding && 'data' in resWedding, 'GET /api/wedding returns data')
  } catch (e: any) {
    assert(false, `GET /api/wedding failed: ${e.message}`)
  }

  try {
    const resApp = await fetch(`${baseUrl}/api/appearance`).then(r => r.json())
    assert(resApp && resApp.data && resApp.data.theme_name, 'GET /api/appearance returns published theme')
  } catch (e: any) {
    assert(false, `GET /api/appearance failed: ${e.message}`)
  }

  try {
    const resProg = await fetch(`${baseUrl}/api/programmes`).then(r => r.json())
    assert(resProg && Array.isArray(resProg.data), 'GET /api/programmes returns array')
  } catch (e: any) {
    assert(false, `GET /api/programmes failed: ${e.message}`)
  }

  try {
    const resGal = await fetch(`${baseUrl}/api/gallery`).then(r => r.json())
    assert(resGal && Array.isArray(resGal.data), 'GET /api/gallery returns array')
  } catch (e: any) {
    assert(false, `GET /api/gallery failed: ${e.message}`)
  }

  // 2. Obtain Admin Auth Token from Supabase
  console.log('\n--- 2. Setting up Admin Authentication ---')
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const anonKey = process.env.SUPABASE_KEY || ''

  const adminClient = createClient(supabaseUrl, serviceKey)
  
  // Create a temporary test admin user or find an existing user
  const { data: { users }, error: listErr } = await adminClient.auth.admin.listUsers()
  let adminToken = ''

  if (users && users.length > 0) {
    const targetUser = users[0]
    // Generate an access token / link for the existing user using admin API
    const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.email!
    })
    
    if (linkData?.properties?.action_link) {
      // Or sign in via password if we create a test user
    }
  }

  // We can create a dedicated test user or sign in
  const testEmail = `test_admin_${Date.now()}@wedding.test`
  const testPassword = 'TestPassword123!'
  const { data: createdUser, error: createErr } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true
  })

  if (createErr) {
    console.error('Failed to create test admin user:', createErr.message)
  } else {
    // Sign in using public client to get valid JWT session
    const publicClient = createClient(supabaseUrl, anonKey)
    const { data: sessionData, error: signInErr } = await publicClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (sessionData.session) {
      adminToken = sessionData.session.access_token
      assert(true, `Admin session created successfully (${testEmail})`)
    } else {
      assert(false, `Admin sign-in failed: ${signInErr?.message}`)
    }
  }

  if (!adminToken) {
    console.error('Cannot proceed with admin tests without admin token.')
    return
  }

  const authHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  }

  // 3. Test Admin Stats
  console.log('\n--- 3. Testing Admin Dashboard Stats ---')
  try {
    const stats = await fetch(`${baseUrl}/api/admin/stats`, { headers: authHeaders }).then(r => r.json())
    assert(stats && stats.data && typeof stats.data.total_guests === 'number', 'GET /api/admin/stats returns valid metrics')
  } catch (e: any) {
    assert(false, `GET /api/admin/stats failed: ${e.message}`)
  }

  // 4. Test Wedding Settings Update
  console.log('\n--- 4. Testing Wedding Settings Update ---')
  try {
    const updateRes = await fetch(`${baseUrl}/api/wedding`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        bride_name_km: 'សុខា',
        bride_name_en: 'Sokha',
        groom_name_km: 'ដារ៉ា',
        groom_name_en: 'Dara',
        venue_name_km: 'សណ្ឋាគារ ហ្គាឌិន',
        venue_name_en: 'Garden Palace Ballroom',
        google_maps_url: 'https://maps.google.com'
      })
    }).then(r => r.json())
    assert(updateRes?.data?.bride_name_en === 'Sokha', 'PUT /api/wedding updates settings successfully')
  } catch (e: any) {
    assert(false, `PUT /api/wedding failed: ${e.message}`)
  }

  // 5. Test Ceremony Programme Management
  console.log('\n--- 5. Testing Programme CRUD ---')
  let createdProgId = ''
  try {
    const progRes = await fetch(`${baseUrl}/api/admin/programmes`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title_km: 'ពិធីហែកូនកំលោះ',
        title_en: 'Groom Procession',
        description_km: 'ពិធីកាត់ផ្កាស្លា',
        description_en: 'Traditional welcome ceremony',
        event_time: new Date(Date.now() + 86400000).toISOString(),
        display_order: 1
      })
    }).then(r => r.json())
    createdProgId = progRes?.data?.id
    assert(Boolean(createdProgId), `POST /api/admin/programmes created event id: ${createdProgId}`)

    // Update programme
    const putProg = await fetch(`${baseUrl}/api/admin/programmes/${createdProgId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title_en: 'Grand Groom Procession'
      })
    }).then(r => r.json())
    assert(putProg?.data?.title_en === 'Grand Groom Procession', 'PUT /api/admin/programmes/:id updated event')
  } catch (e: any) {
    assert(false, `Programme test failed: ${e.message}`)
  }

  // 6. Test Guest & Invitation Flow
  console.log('\n--- 6. Testing Guest Creation & Auto-Invitation ---')
  let testGuestId = ''
  let invitationToken = ''
  let invitationId = ''

  try {
    const guestRes = await fetch(`${baseUrl}/api/admin/guests`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Vannak Heng',
        phone: '+855 12 999 888'
      })
    }).then(r => r.json())

    testGuestId = guestRes?.data?.id
    const inv = guestRes?.data?.invitations?.[0]
    invitationToken = inv?.token
    invitationId = inv?.id

    assert(Boolean(testGuestId), `POST /api/admin/guests created guest id: ${testGuestId}`)
    assert(Boolean(invitationToken), `Invitation token auto-generated: ${invitationToken}`)
  } catch (e: any) {
    assert(false, `Guest creation failed: ${e.message}`)
  }

  // 7. Test Public Invitation Access & Opening Record
  console.log('\n--- 7. Testing Public Invitation Route ---')
  try {
    const publicInv = await fetch(`${baseUrl}/api/invitations/${invitationToken}`).then(r => r.json())
    assert(publicInv?.data?.guest_name === 'Vannak Heng', 'GET /api/invitations/:token returns correct guest name')
    assert(publicInv?.data?.status === 'active', 'Invitation status is active')
  } catch (e: any) {
    assert(false, `Public invitation fetch failed: ${e.message}`)
  }

  // 8. Test Public RSVP Submission
  console.log('\n--- 8. Testing Public RSVP Submission ---')
  try {
    const rsvpRes = await fetch(`${baseUrl}/api/rsvps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: invitationToken,
        attendance_status: 'attending'
      })
    }).then(r => r.json())
    assert(rsvpRes?.data?.attendance_status === 'attending', 'POST /api/rsvps recorded attendance as attending')

    // Verify through admin RSVPs
    const adminRsvps = await fetch(`${baseUrl}/api/admin/rsvps`, { headers: authHeaders }).then(r => r.json())
    const foundRsvp = (adminRsvps?.data || []).find((r: any) => r.attendance_status === 'attending')
    assert(Boolean(foundRsvp), 'GET /api/admin/rsvps lists the submitted response')
  } catch (e: any) {
    assert(false, `RSVP test failed: ${e.message}`)
  }

  // 9. Test Invitation Revoke & Regenerate
  console.log('\n--- 9. Testing Invitation Revoke & Regenerate ---')
  try {
    // Revoke
    const revokeRes = await fetch(`${baseUrl}/api/admin/invitations/${invitationId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ action: 'revoke' })
    }).then(r => r.json())
    assert(revokeRes?.data?.status === 'revoked', 'PATCH /api/admin/invitations/:id revoked invitation')

    // Verify public route rejects revoked invitation (410)
    const checkRevoked = await fetch(`${baseUrl}/api/invitations/${invitationToken}`)
    assert(checkRevoked.status === 410, 'Public route returns 410 for revoked invitation')

    // Regenerate
    const regenRes = await fetch(`${baseUrl}/api/admin/invitations/${invitationId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ action: 'regenerate' })
    }).then(r => r.json())
    const newToken = regenRes?.data?.token
    assert(Boolean(newToken && newToken !== invitationToken), `Regenerated new active token: ${newToken}`)
  } catch (e: any) {
    assert(false, `Revoke/regenerate test failed: ${e.message}`)
  }

  // 10. Test Theme Customizer Save & Publish
  console.log('\n--- 10. Testing Theme Draft & Publish ---')
  try {
    const appRes = await fetch(`${baseUrl}/api/admin/appearance`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        theme_name: 'Khmer Emerald & Gold',
        theme_config: {
          primary: '#183E31',
          secondary: '#D4AF37',
          bg: '#F4F7F4',
          text: '#1C2E25',
          heading: '#183E31',
          border: '#D4AF37',
          accent: '#83B29B',
          highlight: '#D4AF37'
        },
        background_config: { type: 'none' },
        animation_config: {
          enabled: true,
          preset: 'lotus_petals',
          speed: 1.2,
          particle_quantity: 30,
          object_size: 26,
          opacity: 0.8,
          direction: 'down',
          intensity: 1.2,
          desktop_quality: 'high',
          mobile_quality: 'medium'
        },
        opening_animation_config: {
          style: 'golden_seal',
          duration: 2,
          speed: 1,
          sound_enabled: false
        },
        is_published: true
      })
    }).then(r => r.json())
    assert(appRes?.data?.theme_name === 'Khmer Emerald & Gold', 'PUT /api/admin/appearance published new theme')

    // Verify public endpoint reflects published theme
    const publicApp = await fetch(`${baseUrl}/api/appearance`).then(r => r.json())
    assert(publicApp?.data?.theme_name === 'Khmer Emerald & Gold', 'GET /api/appearance returns updated theme')
  } catch (e: any) {
    assert(false, `Appearance test failed: ${e.message}`)
  }

  // 11. Cleanup test records
  console.log('\n--- 11. Cleaning Up Test Data ---')
  if (testGuestId) {
    await fetch(`${baseUrl}/api/admin/guests/${testGuestId}`, { method: 'DELETE', headers: authHeaders })
    console.log('  Cleaned up test guest.')
  }
  if (createdProgId) {
    await fetch(`${baseUrl}/api/admin/programmes/${createdProgId}`, { method: 'DELETE', headers: authHeaders })
    console.log('  Cleaned up test programme.')
  }
  if (createdUser?.user?.id) {
    await adminClient.auth.admin.deleteUser(createdUser.user.id)
    console.log('  Cleaned up test admin account.')
  }

  console.log(`\n========================================`)
  console.log(`  Tests Completed: ${passed} Passed, ${failed} Failed`)
  console.log(`========================================\n`)

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(err => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
