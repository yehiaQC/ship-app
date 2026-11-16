import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { PackageData, ReceiverData } from '../data/testData';

/**
 * Create-shipment form on "/": src/lib/components/ShipmentForm.svelte.
 * Cards unlock in order: sender (pre-filled) -> receiver -> package -> service/options/rate.
 */
export class ShipmentFormPage extends BasePage {
  protected readonly path = '/';
  readonly senderCard: Locator;
  readonly receiverCard: Locator;
  readonly packageCard: Locator;
  readonly totalPrice: Locator;
  readonly saveDraftButton: Locator;
  readonly finalizeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.senderCard = page.getByRole('region', { name: 'Sender Information' });
    this.receiverCard = page.getByRole('group', { name: /Receiver Information/ });
    this.packageCard = page.getByRole('group', { name: /Package Information/ });
    this.totalPrice = page.locator('[aria-labelledby="total-price-label"]');
    this.saveDraftButton = page.getByRole('button', { name: 'Save as Draft' });
    this.finalizeButton = page.getByRole('button', { name: 'Finalize Shipment' });
  }

  /** Shipment-type tag in the package card legend (Domestic / IntraGulf / International). */
  shipmentTypeTag(type: string): Locator {
    return this.packageCard.getByText(type, { exact: true });
  }

  async fillReceiver(r: ReceiverData): Promise<void> {
    const card = this.receiverCard;
    await card.getByLabel('Full Name').fill(r.name);
    await card.getByLabel('Phone Number').fill(r.phone);
    await card.getByLabel('Country').selectOption({ label: r.country });
    await card.getByLabel('City').fill(r.city);
    await card.getByLabel('Street Address').fill(r.street);
    await card.getByLabel('Postal Code').fill(r.postalCode);
    await card.getByLabel('Postal Code').blur();
  }

  async fillPackage(p: PackageData): Promise<void> {
    const card = this.packageCard;
    await card.getByLabel(/^Weight/).fill(String(p.weight));
    await card.getByLabel(/^Length/).fill(String(p.length));
    await card.getByLabel(/^Width/).fill(String(p.width));
    await card.getByLabel(/^Height/).fill(String(p.height));
    await card.getByLabel(/^Height/).blur();
  }

  async selectService(name: string | RegExp): Promise<void> {
    await this.page.getByRole('radio', { name }).check();
  }

  /** Total price shown in the rate card, as a number. */
  async totalPriceValue(): Promise<number> {
    const text = (await this.totalPrice.textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
