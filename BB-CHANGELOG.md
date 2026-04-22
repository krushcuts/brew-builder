# Changelog

All notable changes to the brew-builder app itself are documented here.
Recipe data versioning (your saved recipes) is handled inside the app via the Versions feature.

---

## [1.2.0] — Initial GitHub commit

### Added
- Recipe persistence via Claude `window.storage` API (auto-saves 800ms after edits)
- Multiple recipe support — create, load, delete recipes from the Recipes panel
- Version snapshots — save named versions with full restore; each version previews OG/ABV/IBU/SRM
- **Brew Day Actuals section**
  - Fields: brew date, pre-boil volume, pre-boil OG, batch volume into fermenter, measured OG, measured FG
  - Auto-calculates: actual efficiency (back-calculated from OG + volume + grain bill), actual ABV
  - Target vs Actual comparison table with Δ column (color-coded green/red)
  - Separate brew day notes field
- Mobile responsive layout (640px breakpoint, ≥44px touch targets)

### Grains (25)
2-Row Pale, Maris Otter, Pilsner, Vienna, Munich Light/Dark, Wheat, Rye, Flaked Wheat/Oats/Barley,
Cara-Pils, Crystal 20/40/60/80/120L, Aromatic, Biscuit, Honey Malt, Special B, Chocolate, Roasted Barley, Black Patent, Smoked

### Hops (20)
Amarillo, Azacca, Cascade, Centennial, Chinook, Citra, Columbus, El Dorado, Fuggle, Galaxy,
Hallertau Mittelfrüh, Magnum, Mosaic, Nugget, Saaz, Simcoe, Styrian Goldings, Tettnang, Warrior, Willamette

### Yeasts (14)
US-05, Nottingham, S-33, BE-256, WY1056/1214/1388/1968/3522/3787/2206, WLP001/500, W-34/70

---

## [1.1.0] — Mobile-friendly rebuild

### Changed
- Full responsive rewrite: single-column stacked layout on mobile
- Grain/hop rows: name dropdown on own row, number fields in 3-4 column grid below on mobile
- Stats bar: 3×2 grid on mobile vs 6-column on desktop
- Minimum touch target size 44px on all inputs and buttons
- `useWidth` hook with 640px breakpoint

---

## [1.0.0] — Initial build

### Added
- Recipe name and style selector
- Grain bill with PPG/°L fields, per-grain gravity point contribution, percentage progress bars
- Hop schedule with Boil/Whirlpool/Dry Hop types, per-addition Tinseth IBU
- Yeast selector with attenuation, flocculation, temp range
- SRM color preview with gradient scale and "glass" rendering
- Batch settings: batch size, mash efficiency, total grain, estimated pre-boil OG
- Live stats bar: OG, FG, ABV, IBU, SRM, BU:GU
- Dark industrial aesthetic (Courier Prime mono, Playfair Display serif, amber on near-black)
