import { test, expect } from '@playwright/test';

test.setTimeout(30000);

test('Scenario 1: Playtest and Clearing the Sample Room', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');
  const sampleCard = page.locator('div').filter({ hasText: 'Sample Escape Room' }).first();

  await expect(sampleCard).toBeVisible({ timeout: 10000 });
  await sampleCard.getByRole('button', { name: 'Edit' }).first().click();
  
  await expect(page.getByText('Room Settings')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(500);
  await page.getByTitle('Playtest Escape Room').click();

  await expect(page.getByText('Time Left')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Score')).toBeVisible();
  await page.locator('button[title="Guide Introduction"]').click();
  await page.getByRole('button', { name: 'Got It' }).click();
  await page.locator('button[title="SCQ1 Coding Language"]').click();
  await page.getByRole('button', { name: 'Python' }).click();
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="SCQ2 OOP"]').click();
  await page.getByRole('button', { name: 'Inheritance' }).click();
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="MCQ1 Data Types"]').click();
  await page.getByRole('button', { name: 'String' }).click();
  await page.getByRole('button', { name: 'Number' }).click();
  await page.getByRole('button', { name: 'Boolean' }).click();
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="MCQ2 Loops"]').click();
  await page.getByRole('button', { name: 'For Loop' }).click();
  await page.getByRole('button', { name: 'While Loop' }).click();
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="Code Syntax Fix"]').click();
  await page.locator('textarea').fill('let userName = \'Jane\';');
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="Code Array Index"]').click();
  await page.locator('textarea').fill('console.log(fruits[0]);');
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.locator('button[title="Code Array Append"]').click();
  await page.locator('textarea').fill('items.push(\'Sword\');');
  await page.getByRole('button', { name: 'Submit Answer' }).click();
  await page.getByText('✅ Correct!').click();
  await page.getByRole('button', { name: 'Back to Editor' }).click();
});

test('Scenario 2: Create a New Room with Details and Deleting it Afterwards.', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');
  const roomCard = page.locator('div').filter({ hasText: 'Minutes' }).first();
  const emptyState = page.getByText('No rooms created yet');

  await expect(roomCard.or(emptyState)).toBeVisible({ timeout: 10000 });
  await page.locator('button[title="Create New Room"]').click();

  await expect(page.getByText('Room Settings')).toBeVisible({ timeout: 10000 });
  const testRoomName = 'Playwright Test Room';
  const titleInput = page.locator('input[value="New Room"]');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(testRoomName);

  const minutesInput = page.locator('input[value="5"]');
  await expect(minutesInput).toBeVisible();
  await minutesInput.fill("1");
  
  const secondsInput = page.locator('input[value="30"]');
  await expect(secondsInput).toBeVisible();
  await secondsInput.fill("10");

  const fileInputContainer = page.locator('div:has-text("Background Image")');
  await fileInputContainer.locator('input[type="file"]').first().setInputFiles('public/backgrounds/tempRoom2.jpg');

  await page.waitForTimeout(500);
  await page.locator('button[title="Add Hotspot"]').click();
  await expect(page.getByText('Add New Hotspot')).toBeVisible();

  const titleHotspotInput = page.locator('input[value="New Puzzle"]');
  await expect(titleHotspotInput).toBeVisible();
  await titleHotspotInput.fill("Playwright Test");
  await page.locator('textarea').fill('Playwright Guide Test Content');
  
  await page.getByRole('button', { name: 'Save Hotspot' }).click();

  await page.getByTitle('Save Changes').click();
  await expect(page.getByText('Room saved successfully!')).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: '← Back' }).click();

  const testRoomCard = page.locator('div')
    .filter({ hasText: testRoomName })
    .filter({ has: page.locator('button[title="Delete Room"]') })
    .first();
  await expect(testRoomCard).toBeVisible();
  await testRoomCard.locator('button[title="Delete Room"]').first().click();

  await page.getByRole('button', { name: 'Yes, Delete It' }).click();

  await expect(page.getByText('Room deleted successfully!')).toBeVisible({ timeout: 10000 });
  await expect(testRoomCard).not.toBeVisible();
});