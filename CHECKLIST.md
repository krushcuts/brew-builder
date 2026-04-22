# Brew Builder — Feature Checklist

## Completed ✓
- [x] Grain bill with PPG, °L, per-grain % and gravity points
- [x] Hop schedule (Boil / Whirlpool / Dry Hop) with Tinseth IBU
- [x] Yeast selector with attenuation, floc, temp range
- [x] Live stats: OG, FG, ABV, IBU, SRM, BU:GU
- [x] SRM color preview (Morey formula + gradient scale)
- [x] Batch settings (size, efficiency, pre-boil OG)
- [x] Mobile responsive layout (640px breakpoint)
- [x] Recipe persistence (Claude artifact storage, auto-save)
- [x] Multiple recipes with create/load/delete
- [x] Version snapshots with labels and full restore
- [x] Brew day actuals (pre-boil OG, OG, FG, batch vol, brew date)
- [x] Actual efficiency + ABV auto-calculated from actuals
- [x] Target vs Actual comparison table with Δ column

## Backlog
- [ ] Water chemistry panel (Ca, Mg, Na, Cl, SO4, HCO3 targets)
- [ ] Mash calculator (strike water temp, volume, step mash)
- [ ] Boil-off / volume calculator (pre-boil → post-boil → fermenter)
- [ ] Fermentation temperature log (date + temp entries)
- [ ] Tasting notes with rating fields
- [ ] Recipe export (plain text / JSON / BeerXML)
- [ ] Import from BeerXML
- [ ] Recipe scaling (adjust for different batch sizes)
- [ ] Duplicate recipe
- [ ] Priming sugar calculator (carbonation target → sugar weight)
- [ ] Water-to-grain ratio / mash thickness display
- [ ] Hop utilization toggle (Tinseth vs Rager vs Garetz)
- [ ] Adjunct / sugar support (honey, DME, corn sugar, etc.)
- [ ] Yeast starter calculator (cell count, DME, water)
- [ ] Standalone deployment (swap window.storage → localStorage, Vite scaffold, Vercel)
