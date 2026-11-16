import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { LoginPage } from '../pages/LoginPage';
import { ShipmentFormPage } from '../pages/ShipmentFormPage';
import { ShipmentsPage } from '../pages/ShipmentsPage';

/**
 * Custom fixtures: tests ask for page objects by name instead of constructing them.
 * Every UI test also auto-dismisses the "Special Offer!" promo that the shipments
 * page shows at random (ship-app/src/lib/components/shipments/PromoModal.svelte).
 */
type Fixtures = {
  api: ApiClient;
  loginPage: LoginPage;
  shipmentForm: ShipmentFormPage;
  shipmentsPage: ShipmentsPage;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    const promo = page.getByRole('dialog', { name: 'Special Offer!' });
    await page.addLocatorHandler(promo, async () => {
      await promo.getByRole('button', { name: 'Close' }).click();
    });
    await use(page);
  },
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shipmentForm: async ({ page }, use) => {
    await use(new ShipmentFormPage(page));
  },
  shipmentsPage: async ({ page }, use) => {
    await use(new ShipmentsPage(page));
  },
});

export { expect };
