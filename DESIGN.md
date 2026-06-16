# AZHAR Design System

## Visual Identity
- **Primary color**: Deep Emerald Green `#1A6B4A` — Islamic tradition, trust, ethical wealth
- **Secondary color**: Rich Gold `#C9A84C` — Zakat, Nisab thresholds, Islamic heritage
- **Background**: Off-white `#F8F6F1` — clean, paper-like, authoritative
- **Surface**: Pure white `#FFFFFF` with subtle warm shadow
- **Danger/Haram**: Deep Red `#C0392B`
- **Warning/Mashbooh**: Amber `#E67E22`
- **Success/Halal**: Emerald `#27AE60`
- **Text primary**: Near-black `#1A1A2E`
- **Text secondary**: Cool slate `#5A6B7B`

## Typography
- **Display / Headings**: Playfair Display — elegant, institutional authority
- **Body / Data**: Inter — clean, highly legible for dense compliance data
- **Accent / Labels**: Arabic-inspired geometric feel via CSS letter-spacing on uppercase Inter
- **Base size**: 16px, 1.6 line-height for readability

## Elevation & Surfaces
- Cards: 1px border `#E8E4DC`, 8px border-radius, subtle box-shadow `0 2px 8px rgba(0,0,0,0.06)`
- Dashboard panels: white background on `#F8F6F1` page
- Modals/drawers: 16px border-radius, backdrop blur

## Component Style
- **Buttons**: Filled emerald primary, gold outlined secondary, 6px border-radius, uppercase tracking
- **Status badges**: Pill-shaped, color-coded (Halal green, Haram red, Mashbooh amber)
- **Tables**: Striped rows, sticky header, sortable columns, row hover highlight
- **Charts**: Minimal, flat — bar and donut charts only, emerald + gold palette
- **Icons**: Outline style, consistent 24px grid (Lucide or Heroicons)
- **Sidebar nav**: Dark emerald `#0F3D2A` background, white icons and labels, gold active indicator

## Layout
- **Dashboard shell**: Fixed sidebar (240px) + top header + scrollable main content
- **Grid**: 12-column, 24px gutter
- **Spacing scale**: 4 / 8 / 16 / 24 / 32 / 48 / 64px
- **Responsive**: Sidebar collapses to bottom nav on mobile

## Tone in UI Copy
- Professional, precise — "Transaction flagged: Riba-based instrument detected" not "Oops!"
- Use Islamic finance terminology correctly: Riba, Gharar, Maysir, Halal, Haram, Mashbooh, Zakat, Nisab, Hawl, Musharakah, Mudarabah
- Dates shown in both Gregorian and Hijri calendar where relevant
