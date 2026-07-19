import { test, expect } from '@playwright/test';

const BASE_URL      = 'https://eventhub.rahulshettyacademy.com'
// ── Credentials ────────────────────────────────────────────────────────────────
const USER_EMAIL    = 'g.sarkar22@gmail.com';// update email and password with your account
const USER_PASSWORD = 'P@ssw0rd'; 

// ── Helpers ────────────────────────────────────────────────────────────────────
async function login(page) {
  await page.goto(`${BASE_URL}/login`);

  // Located by placeholder
  await page.getByPlaceholder('you@email.com').fill(USER_EMAIL);

  // Located by label
  await page.getByLabel('Password').fill(USER_PASSWORD);

  // Located by id
  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}


// ── Test ───────────────────────────────────────────────────────────────────────
test('create event via UI, book it, and verify seat reduction', async ({ page }) => {

  // ── Step 1: Log in ───────────────────────────────────────────────────────
  await login(page);

  // ── Step 2: Create a new event via the admin form ────────────────────────
  await page.goto(`${BASE_URL}/admin/events`);

  // Unique title so we can find this exact card later
  const eventTitle = `Test Event ${Date.now()}`;

  // Located by id (explicit on the component)
  await page.locator('#event-title-input').fill(eventTitle);

  // Description — only textarea in the form
  await page.locator('#admin-event-form textarea').fill('Playwright test event');

  // Located by label (Select auto-generates id from label text)
  await page.getByLabel('City').fill('Test City');
  await page.getByLabel('Venue').fill('Test Venue');

  // datetime-local input — located by label
  await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');

  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');

  // Located by id
  await page.locator('#add-event-btn').click();

  // Wait for success toast
  await expect(page.getByText('Event created!')).toBeVisible();

  console.log(`Created event: "${eventTitle}"`);

  // ── Step 3: Go to Events page and find the newly created card ─────────────
  await page.goto(`${BASE_URL}/events`);

  // Located by data-testid
  const eventCards = page.getByTestId('event-card');
  await expect(eventCards.first()).toBeVisible();

  // Scan all visible event cards for the one matching our created title
  const targetCard = eventCards.filter({ hasText: eventTitle }).first();
  await expect(targetCard).toBeVisible({ timeout: 5000 });

  // Capture seat count before booking
  const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
  console.log(`Seats before booking: ${seatsBeforeBooking}`);

  // Located by data-testid inside the matched card
  await targetCard.getByTestId('book-now-btn').click();

  // ── Step 4: Fill the booking form ────────────────────────────────────────

  // Quantity defaults to 1 — verify via id
  const ticketCount = page.locator('#ticket-count');
  await expect(ticketCount).toHaveText('1');

  // Located by label
  await page.getByLabel('Full Name').fill('Test Student');

  // Located by id
  await page.locator('#customer-email').fill('g.sarkar22@gmail.com');

  // Located by placeholder
  await page.getByPlaceholder('+91 98765 43210').fill('7411198809');

  // Located by CSS class
  await page.locator('.confirm-booking-btn').click();

  // ── Step 5: Verify booking confirmation ──────────────────────────────────

  // Located by CSS class
  const bookingRefEl = page.locator('.booking-ref').first();
  await expect(bookingRefEl).toBeVisible();

  const bookingRef = (await bookingRefEl.innerText()).trim();
  expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());

  console.log(`Booking confirmed. Ref: ${bookingRef}`);

  // ── Step 6: Verify booking appears in My Bookings ────────────────────────
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  // Located by id
  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  // Find the card that contains our booking ref (via CSS class inside the card)
  const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
  await expect(matchingCard).toBeVisible();

  // Verify event title also appears in the same card
  await expect(matchingCard).toContainText(eventTitle);

  console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);

  // ── Step 7: Verify seat count reduced on Events page ─────────────────────
  await page.goto(`${BASE_URL}/events`);
  await expect(eventCards.first()).toBeVisible();

  // Find the same event by title
  const updatedCard       = eventCards.filter({ hasText: eventTitle }).first();
  await expect(updatedCard).toBeVisible();

  const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
  console.log(`Seats after booking: ${seatsAfterBooking}`);

  // Booked 1 ticket — count must drop by exactly 1
  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});

// What you are testing: Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.

// Setup

// - BASE_URL = https://eventhub.rahulshettyacademy.com

// - Credentials: < Create your own credentials>

// - Write a reusable login(page) helper function — you will call it at the start of the test





// Steps

// Step 1 — Login

// - Navigate to /login

// - Fill email field (locate by placeholder you@email.com)

// - Fill password field (locate by label Password)

// - Click the login button (locate by id #login-btn)

// - Assert: link with text Browse Events → is visible (confirms login success)



// Step 2 — Create a new event

// - Navigate to /admin/events

// - Generate a unique event title using Test Event ${Date.now()} — store this in a variable, you will need it throughout the test

// - Fill Title field (locate by id #event-title-input)

// - Fill Description textarea (locate using #admin-event-form textarea)

// - Fill City field (locate by label City)

// - Fill Venue field (locate by label Venue)

// - Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper

// - Fill Price ($) field (locate by label Price ($)) — use any number e.g. 100

// - Fill Total Seats field (locate by label Total Seats) — use 50

// - Click the submit button (locate by id #add-event-btn)

// - Assert: toast message Event created! is visible



// Step 3 — Find the event card and capture seats

// - Navigate to /events

// - Get all event cards (locate by data-testid="event-card")

// - Assert the first card is visible (confirms page loaded)

// - From all cards, filter for the one that contains your event title text

// - Assert the matched card is visible (timeout 5 seconds)

// - Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — store this as seatsBeforeBooking



// Step 4 — Start booking

// - On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)



// Step 5 — Fill booking form

// - Assert: element with id #ticket-count has text 1 (default quantity)

// - Fill Full Name (locate by label Full Name)

// - Fill Email (locate by id #customer-email)

// - Fill Phone (locate by placeholder +91 98765 43210)

// - Click the confirm button (locate by CSS class .confirm-booking-btn)



// Step 6 — Verify booking confirmation

// - Locate the booking reference element (locate by CSS class .booking-ref, take .first())

// - Assert it is visible

// - Read its inner text, trim it — store as bookingRef



// Step 7 — Verify in My Bookings

// - Click the link View My Bookings

// - Assert: URL is BASE_URL/bookings

// - Get all booking cards (locate by id #booking-card)

// - Assert the first booking card is visible

// - Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text

// - Assert that matched card is visible

// - Assert that matched card contains your eventTitle text



// Step 8 — Verify seat reduction

// - Navigate back to /events

// - Assert the first event card is visible

// - Filter cards again using hasText: eventTitle

// - Assert the card is visible

// - Read the seat count text again (same as Step 3) — store as seatsAfterBooking

// - Assert: seatsAfterBooking === seatsBeforeBooking - 1



// Questions for this assignment
// Complete the Playwright code for given manual Instructions.