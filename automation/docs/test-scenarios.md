# Test scenarios: ShipTest

## Sources
- User stories in `../stories/` (US-001 login, US-020..US-046 receiver/package/service, US-060 rates, US-07x shipment list, US-078 finalize).
- App source: `src/routes/login`, `src/lib/components/ShipmentForm.svelte`, `DynamicCard.svelte`, `shipments/ShipmentsTable.svelte`, `shipments/PromoModal.svelte`.
- Exploring the running app at http://localhost:3000.

## Scenario inventory

| ID | Scenario | Type | Priority | Layer | Spec file | Status |
|----|----------|------|----------|-------|-----------|--------|
| E2E-001 | Happy path: log in with valid credentials (KSA user) -> create a shipment to the UAE (IntraGulf, 2 kg, Gulf Standard, price > 0) and save it as a draft -> finalize it from the shipments list -> row shows Finalized with a tracking number | E2E | High | UI | tests/ui/happy-path.spec.ts | ✅ Automated (`@smoke`) |
| E2E-002 | Create and finalize in one step with the form's "Finalize Shipment" button | E2E | High | UI | | ⏭ Not automated yet |
| AUTH-xx | Login negatives (wrong password, empty fields), logout, protected routes | Negative | High | UI/API | | ⏭ Not automated yet |
| FORM-xx | Weight limits per shipment type, Gulf street rule, Gulf-to-Iraq block, item description rule | Validation | High | UI/API | | ⏭ Not automated yet |
| API-xx | Shipments API contract, 401/404, server-side business rules | API | High | API | | ⏭ Not automated yet |

Status values: ✅ Automated (passing) · 🐞 Automated, fails because of an app bug (marked `test.fail`) · ⏭ Not automated (reason)

## Notes
- The shipments page shows a "Special Offer!" promo at random (~50%). Every UI test dismisses it automatically (`page.addLocatorHandler` in `src/fixtures/index.ts`).
- Each run uses a unique receiver name to find its own row. `afterEach` deletes only the shipment that run created, via `DELETE /api/shipments/:id`.

## Known application bugs found while automating
None in the happy path. Open defects from the manual QA cycle (BUG-001..BUG-007) are outside this flow.
