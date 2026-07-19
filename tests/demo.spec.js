const { test, expect } = require('@playwright/test')
 
test ('@Web Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'zara coat 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client")
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").type("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
 
})


test ('UI controls ', async ({ page }) => { 
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    const username= await page.locator("#username")
    const password= await page.locator("#password")
    const documentLink=await page.locator("[href*='documents-request']")
    const dropdown=await page.locator("select.form-control")
    await dropdown.selectOption("Consultant")
    await page.locator(".radiotextsty").nth(1).click()
    await page.locator("#okayBtn").click()
    await expect(page.locator(".radiotextsty").nth(1)).toBeChecked()
    await page.locator("#terms").click()
    await expect(page.locator("#terms")).toBeChecked()
    await page.locator("#terms").uncheck()
    expect(await page.locator("#terms").isChecked()).toBeFalsy()
    await expect(documentLink).toHaveAttribute("class","blinkingText")

})


test ('child window ', async ({ browser }) => { 
    const context=await browser.newContext()
    const page=await context.newPage()

await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
const documentLink=await page.locator("[href*='documents-request']")

const [newpage]= await Promise.all([
context.waitForEvent('page'),
documentLink.click(),
])
const text=await newpage.locator(".red").textContent()
 console.log('Text is:',text)
const arrayText= text.split('@')
const domain=arrayText[1].split(" ")[0]
console.log(domain)
await page.locator("#username").fill(domain)
console.log(await page.locator("#username").textContent())


})