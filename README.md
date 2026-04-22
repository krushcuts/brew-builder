# Brew Builder

A homebrew recipe formulation tool built as a Claude artifact (React JSX).

## Features

- **Recipe formulation** — grain bill, hop schedule, yeast selection
- **Live calculations** — OG, FG, ABV (Tinseth IBU, Morey SRM, standard gravity)
- **Brew day actuals** — record measured pre-boil OG, OG, FG, batch volume; auto-calculates actual efficiency and ABV
- **Target vs actual comparison** — delta view for every measurable stat
- **Recipe persistence** — recipes saved to Claude artifact storage, accessible from any device logged into your Claude account
- **Version snapshots** — save named versions (e.g. "Brew Day 1", "Adjusted hop bill") with full restore
- **Mobile responsive** — 640px breakpoint; all touch targets ≥ 44px

## Usage

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation (or continue this one)
3. Paste the contents of `brew-builder.jsx` into the message, asking Claude to render it as an artifact
4. Or: share this file with Claude and ask it to display the artifact

## Storage notes

Recipes are stored in Claude's artifact `window.storage` API — tied to your Claude account, not your browser or device. They persist across sessions and devices as long as you're logged in. There is currently no export/import functionality.

To use as a fully standalone app (no Claude dependency), swap all `window.storage` calls for `localStorage` — this is a ~10 minute change that enables deployment to Vercel/Netlify.

## File structure

```
brew-builder/
├── README.md          — this file
├── CHANGELOG.md       — version history of the app itself
└── brew-builder.jsx   — the full React component (single file, no dependencies beyond React)
```

## Calculations

| Stat | Formula |
|------|---------|
| OG   | `1 + (sum(lbs × PPG × eff%) / batch_gal) / 1000` |
| FG   | `1 + OG_pts × (1 - attenuation%)` |
| ABV  | `(OG - FG) × 131.25` |
| IBU  | Tinseth utilization model |
| SRM  | Morey formula: `1.4922 × MCU^0.6859` |
| Actual Eff | `(actual_OG_pts × actual_vol) / total_grain_pts × 100` |
