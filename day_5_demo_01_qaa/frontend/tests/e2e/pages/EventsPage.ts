import type { Page, Locator } from '@playwright/test'

export class EventsPage {
  readonly page: Page
  private readonly heading: Locator
  private readonly eventCards: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Events' })
    this.eventCards = page.locator('.event-card')
  }

  async goto(): Promise<void> {
    await this.page.goto('/events')
  }

  getHeading(): Locator {
    return this.heading
  }

  getEventCards(): Locator {
    return this.eventCards
  }

  getEventCardByTitle(title: string): Locator {
    return this.page.locator('.event-card').filter({ hasText: title })
  }
}
