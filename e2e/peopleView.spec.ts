// tests/peopleView.spec.ts
import { test, expect, Page } from '@playwright/test'

test.describe('PeopleView Component', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.goto('/people')
  })

  test('should load and display people cards', async () => {
    // Check if loading indicator is shown initially
    await expect(page.locator('.loading')).toBeVisible()

    // Wait for content to load
    await expect(page.locator('.loading')).toBeHidden()

    // Check if people cards are displayed
    const cards = page.locator('.content__list>article')
    await expect(cards).not.toHaveCount(0)
  })

  test('should handle search functionality', async () => {
    // Wait for content to load
    await expect(page.locator('.loading')).toBeHidden()
    await page.locator('.card:first-child').waitFor()

    // Get initial count of people
    const initialCount = await page.locator('.content__list>article').count()
    console.log(initialCount)
    expect(initialCount).toBeGreaterThan(0)

    // Search for a specific character (Luke)
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('Luke')
    await searchInput.press('Enter')

    // Check if results are filtered
    const filteredCards = page.locator('.content__list>article')
    const filteredCount = await filteredCards.count()
    expect(filteredCount).toBeLessThan(initialCount)

    // Check if the filtered results contain the search term
    const cardTitles = await page.locator('.card__title').allTextContents()
    cardTitles.forEach((title: string) => {
      expect(title).toContain('Luke')
    })

    // Clear search
    const clearButton = page.locator('.search-field__clear')
    await clearButton.click()

    // Check if all cards are back
    const clearedCount = await page.locator('.content__list>article').count()
    expect(clearedCount).toEqual(initialCount)
  })

  test('should handle sorting by name', async () => {
    // Wait for content to load
    await page.locator('.card:first-child').waitFor()

    // Sort by name (ascending)
    const nameSortButton = page.locator('#person-name-sort')
    await nameSortButton.click()

    // Get initial order of names
    const sortedNamesAsc = await page.locator('.card__title').allTextContents()
    expect(sortedNamesAsc.length).toBeGreaterThan(1)

    // Check if sorted correctly
    const expectedAsc = [...sortedNamesAsc].sort((a, b) => a.localeCompare(b))
    expect(sortedNamesAsc).toEqual(expectedAsc)

    // Sort by name (descending)
    await nameSortButton.click()

    // Get sorted names
    const sortedNamesDesc = await page.locator('.card__title').allTextContents()

    // Check if sorted correctly
    const expectedDesc = [...sortedNamesDesc].sort((a, b) => b.localeCompare(a))
    expect(sortedNamesDesc).toEqual(expectedDesc)
  })

  test('should handle sorting by date', async () => {
    // Wait for content to load
    await page.locator('.card:first-child').waitFor()

    // Sort by date (ascending)
    const dateSortButton = page.locator('#person-date-sort')
    await dateSortButton.click()

    // Get first card's date
    const firstDateText = page.locator('.card:first-child>p')
    await expect(firstDateText).toHaveText(/.+/)
    const firstDateAsc = (await firstDateText.textContent()) as string

    // Sort by date (descending)
    await dateSortButton.click()

    // Get first card's date
    const firstDateDesc = page.locator('.card:first-child>p')

    // Dates should be different after sorting
    await expect(firstDateDesc).not.toHaveText(firstDateAsc)
  })

  test('should handle pagination', async () => {
    // Wait for content to load
    await page.locator('.card:first-child').waitFor()

    // Get first page's first card name
    const firstPageFirstName = page.locator('.card:first-child>h3')
    const firstPageFirstNameText = (await firstPageFirstName.textContent()) as string
    await expect(firstPageFirstName).toHaveText(/.+/)

    // Go to next page
    const nextButton = page.locator('a:has-text("Next")')
    await nextButton.click()

    // Get second page's first card name
    const secondPageFirstName = page.locator('.card:first-child>h3')
    await expect(secondPageFirstName).toHaveText(/.+/)

    // Names should be different
    await expect(secondPageFirstName).not.toHaveText(firstPageFirstNameText)

    // Go back to first page
    const prevButton = page.locator('a:has-text("Previous")')
    await prevButton.click()

    // Get first page's first card name again
    const firstPageFirstNameAgain = page.locator('.card:first-child>h3')
    await expect(firstPageFirstName).toHaveText(/.+/)

    // Should match original first name
    await expect(firstPageFirstNameAgain).toHaveText(firstPageFirstNameText)
  })

  test('should display empty state when no results found', async () => {
    // Wait for content to load
    await page.locator('.card:first-child').waitFor()
    // await card.waitFor()

    // Search for non-existent character
    await page.fill('input[type="search"]', 'NonExistentCharacter123')
    await page.keyboard.press('Enter')

    // Check if empty state is displayed
    const emptyState = page.locator('.content__no-content')
    await expect(emptyState).toBeVisible()

    const emptyMessage = page.locator('.content__no-content > p:first-child')
    await expect(emptyMessage).toContainText(/Nothing found, hmm */)
  })

  test('should handle error state', async () => {
    // Mock API failure
    await page.route('https://swapi.info/api/people', (route) => route.abort())

    // Reload page to trigger the error
    await page.reload()

    // Check if error message is displayed
    const errorMessage = page.locator('.content__no-content')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText(/Wrong, something went.*/)
  })
})
