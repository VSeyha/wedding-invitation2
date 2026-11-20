-- ============================================================
-- Migration: 003_seed_defaults.sql
-- Description: Insert default wedding settings and
--              the default Khmer Royal Burgundy & Gold theme
-- ============================================================

-- ============================================================
-- Default wedding settings (single row)
-- Uses DO block to skip gracefully if a row already exists
-- ============================================================
do $$
begin
  if not exists (select 1 from public.wedding_settings limit 1) then
    insert into public.wedding_settings (
      bride_name_km,
      bride_name_en,
      groom_name_km,
      groom_name_en,
      wedding_date,
      venue_name_km,
      venue_name_en,
      venue_address_km,
      venue_address_en,
      google_maps_url,
      invitation_message_km,
      invitation_message_en
    ) values (
      'ឈ្មោះកូនក្រមុំ',
      'Bride Name',
      'ឈ្មោះកូនកំលោះ',
      'Groom Name',
      now() + interval '90 days',
      'ឈ្មោះស្ថានដ្ឋានប្រារព្ធពិធី',
      'Wedding Venue Name',
      'អាសយដ្ឋានស្ថានដ្ឋានប្រារព្ធពិធី',
      'Wedding Venue Address',
      'https://maps.google.com',
      'យើងខ្ញុំមានកិត្តិយសដ៏ខ្ពង់ខ្ពស់សូមគោរពអញ្ជើញ ចូលរួមជាអធិបតី និងជាសាក្សីក្នុងពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ',
      'We joyfully request the honor of your presence to celebrate our wedding ceremony and witness our union.'
    );
  end if;
end;
$$;

-- ============================================================
-- Default appearance: Khmer Royal Burgundy & Gold (published)
-- Uses DO block to skip gracefully if a row already exists
-- ============================================================
do $$
begin
  if not exists (select 1 from public.wedding_appearance limit 1) then
    insert into public.wedding_appearance (
      theme_name,
      theme_config,
      background_config,
      animation_config,
      opening_animation_config,
      is_published
    ) values (
      'Khmer Royal Burgundy & Gold',
      '{
        "primary":   "#641D2D",
        "secondary": "#C9A24A",
        "bg":        "#F7F0E3",
        "text":      "#3C2925",
        "heading":   "#641D2D",
        "border":    "#C9A24A",
        "accent":    "#E5C77A",
        "highlight": "#E5C77A"
      }'::jsonb,
      '{
        "type":            "none",
        "opacity":         0.15,
        "overlay_color":   "#641D2D",
        "overlay_opacity": 0.05
      }'::jsonb,
      '{
        "enabled":           true,
        "preset":            "lotus_petals",
        "speed":             1,
        "particle_quantity": 25,
        "object_size":       24,
        "opacity":           0.7,
        "direction":         "down",
        "intensity":         1,
        "desktop_quality":   "high",
        "mobile_quality":    "medium"
      }'::jsonb,
      '{
        "style":         "golden_seal",
        "duration":      1.6,
        "speed":         1,
        "sound_enabled": false
      }'::jsonb,
      true
    );
  end if;
end;
$$;
