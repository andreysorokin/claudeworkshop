import type { Page, Locator } from '@playwright/test'

export class VolunteersPage {
  readonly page: Page
  private readonly heading: Locator
  private readonly volunteerCards: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Volunteers' })
    this.volunteerCards = page.locator('.event-card')
  }

  async goto(): Promise<void> {
    await this.page.goto('/volunteers')
  }

  getHeading(): Locator {
    return this.heading
  }

  getVolunteerCards(): Locator {
    return this.volunteerCards
  }

  getVolunteerCardByName(name: string): Locator {
    return this.page.locator('.event-card').filter({ hasText: name })
  }
}
