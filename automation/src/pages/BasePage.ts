import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Shared behaviour for every page object.
 * Page objects hold locators and user-level actions; assertions about business
 * outcomes belong in the tests, so a page object can be reused by many scenarios.
 */
export abstract class BasePage {
  /** Path relative to baseURL, e.g. '/login'. */
  protected abstract readonly path: string;

  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Locator for an inline message/alert; override in a page if the app uses something else. */
  message(text?: string | RegExp): Locator {
    const alerts = this.page.getByRole('alert');
    return text ? alerts.filter({ hasText: text }) : alerts;
  }

  async expectUrl(path: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }
}
