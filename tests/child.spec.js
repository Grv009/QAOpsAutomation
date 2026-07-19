const { test, expect } = require('@playwright/test')

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