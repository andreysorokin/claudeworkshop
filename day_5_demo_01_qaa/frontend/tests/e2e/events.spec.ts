import { test, expect } from '@playwright/test'
import { EventsPage } from './pages/EventsPage'

test('shows the events list', async ({ page }) => {
  const eventsPage = new EventsPage(page)
  await eventsPage.goto()
  await expect(eventsPage.getHeading()).toBeVisible()
  await expect(eventsPage.getEventCards()).toHaveCount(8)
})
