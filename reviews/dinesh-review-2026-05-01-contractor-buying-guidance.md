# Dinesh Review - Contractor Buying Guidance

### Verdict
Approve

### What changed
- Added city-level supplier insights for delivery, account openness, contractor pricing, showroom support, trade counts, and top-rated supplier.
- Added FAQ structured data to city pages and ItemList/FAQ structured data to city trade pages.
- Added a visible contractor snapshot section to city pages with trade-specific internal links.

### Risks found
- severity: low
- file or area: `src/components/SchemaMarkup.tsx`
- issue: City and trade pages can now both emit FAQPage JSON-LD on category URLs.
- consequence: This is acceptable because the schemas describe the visible FAQ content on each page, but rich-result eligibility is ultimately search-engine controlled.
- suggested fix: No change needed for this pass.

### Confidence
High

Build: `npm run build` passed on 2026-05-01.
