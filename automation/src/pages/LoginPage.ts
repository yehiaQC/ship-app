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

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
