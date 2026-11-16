import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /login: src/routes/login/+page.svelte */
export class LoginPage extends BasePage {
  protected readonly path = '/login';
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Log In' });
  }

  /**
   * Open the page and wait until the app's JavaScript has loaded (no network
   * activity left). On a cold dev server the HTML arrives before Svelte hydrates
   * the form; submitting it then does a native GET to /login?email=...&password=...
   * instead of calling /api/auth/login. Seen in CI run #2.
   */
  override async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
