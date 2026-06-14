import type { Page, Locator } from '@playwright/test'

export class VolunteersPage {
  readonly page: Page
  private readonly heading: Locator
  private readonly staffCards: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Staff' })
    this.staffCards = page.locator('.event-card')
  }

  async goto(): Promise<void> {
    await this.page.goto('/staff')
  }

  getHeading(): Locator {
    return this.heading
  }

  getVolunteerCards(): Locator {
    return this.staffCards
  }

  getVolunteerCardByName(name: string): Locator {
    return this.page.locator('.event-card').filter({ hasText: name })
  }
}
