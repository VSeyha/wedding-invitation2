// GET /api/invitations/[token] - Public: load invitation by token
import { validateInvitationToken, markInvitationOpened } from '~~/server/utils/invitation'
import { uuidSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token') || ''
  const parsed = uuidSchema.safeParse(token)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid invitation token' })
  }

  const invitation = await validateInvitationToken(token)

  // Skip marking as opened for SSR metadata prefetches or social link-preview bots (Telegram, Facebook, etc.)
  const query = getQuery(event)
  const userAgent = getHeader(event, 'user-agent') || ''
  const isPreviewOrBot =
    query.preview === '1' ||
    /TelegramBot|facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|Discordbot|Googlebot|bingbot/i.test(userAgent)

  if (!isPreviewOrBot) {
    // Mark as opened (async, non-blocking)
    markInvitationOpened(invitation.id).catch(() => {})
  }

  // Return safe public data only
  return {
    data: {
      token: invitation.token,
      status: invitation.status,
      guest_name: (invitation.guests as any)?.name || '',
      opened_at: invitation.opened_at,
      rsvp: invitation.rsvps
        ? {
            status: (invitation.rsvps as any).attendance_status,
            submitted_at: (invitation.rsvps as any).submitted_at
          }
        : null
    }
  }
})
