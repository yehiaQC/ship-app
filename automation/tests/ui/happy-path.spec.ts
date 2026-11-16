import { test, expect } from '../../src/fixtures';
import { intraGulfReceiver, services, smallPackage, users } from '../../src/data/testData';

/**
 * E2E-001 Happy path: log in with valid credentials -> create a shipment -> finalize it.
 * Stories: US-001 (login), US-020..US-046 (receiver, package, service), US-060 (rate),
 * US-07x (shipment list) and US-078 (finalize a draft).
 */
test.describe('Happy path', () => {
  let createdId: number | undefined;

  test.afterEach(async ({ page }) => {
    // Remove only the shipment this test created, using the logged-in session.
    if (createdId !== undefined) {
      await page.request.delete(`/api/shipments/${createdId}`);
      createdId = undefined;
    }
  });

  test('user logs in, creates a shipment and finalizes it @smoke', async ({
    page,
    loginPage,
    shipmentForm,
    shipmentsPage,
  }) => {
    expect(users.ksa.password, 'Set E2E_USER_PASSWORD in automation/.env').not.toBe('');
    const receiver = intraGulfReceiver();

    await test.step('Log in with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login(users.ksa.email, users.ksa.password);
      await expect(page).toHaveURL('/');
      await expect(shipmentForm.senderCard).toContainText(`${users.ksa.fullName} - ${users.ksa.country}`);
    });

    await test.step('Create the shipment (receiver, package, service) and save it', async () => {
      await shipmentForm.fillReceiver(receiver);
      await shipmentForm.fillPackage(smallPackage);
      await expect(shipmentForm.shipmentTypeTag('IntraGulf')).toBeVisible();

      await shipmentForm.selectService(services.gulfStandard);
      await expect(shipmentForm.totalPrice).toHaveText(/\d/);
      expect(await shipmentForm.totalPriceValue()).toBeGreaterThan(0);

      await shipmentForm.saveDraftButton.click();
      await expect(page).toHaveURL(/\/shipments\?success=true/);
      await expect(shipmentsPage.successBanner).toBeVisible();

      const row = shipmentsPage.row(receiver.name);
      await expect(row).toHaveCount(1);
      await expect(row).toContainText('Draft');
      await expect(row).toContainText(`${receiver.city}, ${receiver.country}`);
      await expect(shipmentsPage.trackingCell(receiver.name)).toHaveText('-');
      createdId = await shipmentsPage.draftId(receiver.name);
    });

    await test.step('Finalize the shipment', async () => {
      await shipmentsPage.finalize(receiver.name);

      const row = shipmentsPage.row(receiver.name);
      await expect(row).toContainText('Finalized');
      await expect(shipmentsPage.trackingCell(receiver.name)).not.toHaveText('-');
      await expect(shipmentsPage.trackingCell(receiver.name)).toHaveText(/\S{4,}/);
    });
  });
});
