import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /shipments: src/routes/shipments/+page.svelte and ShipmentsTable.svelte */
export class ShipmentsPage extends BasePage {
  protected readonly path = '/shipments';
  readonly successBanner: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.successBanner = page.getByRole('status').filter({ hasText: 'Shipment saved successfully!' });
    this.table = page.getByRole('table', { name: 'Your shipments' });
  }

  /** The table row for a receiver name (test data makes these unique per run). */
  row(receiverName: string): Locator {
    return this.table.getByRole('row').filter({ hasText: receiverName });
  }

  /** The row's actions-menu button; its accessible name holds the draft id or the tracking number. */
  actionsButton(receiverName: string): Locator {
    return this.row(receiverName).getByRole('button', { name: /^Actions for / });
  }

  /** Reads the shipment id from a draft row ("Actions for draft shipment 42"). */
  async draftId(receiverName: string): Promise<number> {
    const name = (await this.actionsButton(receiverName).getAttribute('aria-label')) ?? '';
    const match = name.match(/draft shipment (\d+)/);
    if (!match) throw new Error(`Row for "${receiverName}" is not a draft: "${name}"`);
    return Number(match[1]);
  }

  async finalize(receiverName: string): Promise<void> {
    await this.actionsButton(receiverName).click();
    await this.page.getByRole('menuitem', { name: 'Finalize Shipment' }).click();
  }

  /** Tracking-number cell (row header); shows "-" for drafts. */
  trackingCell(receiverName: string): Locator {
    return this.row(receiverName).getByRole('rowheader');
  }
}
