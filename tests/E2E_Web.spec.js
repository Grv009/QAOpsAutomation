const { test, expect } = require('@playwright/test')
 
test ('@Web Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");

   await page.goto("https://rahulshettyacademy.com/client")
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").type("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body").first().waitFor()
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count=await products.count()
   for (let i=0;i<count;++i)
   {
      if(await products.nth(i).locator("b").textContent()===productName)
      {
         await products.nth(i).locator("text= Add To Cart").click()
         console.log(productName,"Added in cart")
         break
      }
   }
   await page.locator("[routerlink*='cart']").click()
   await page.locator("div li").first().waitFor()
   const bool= await page.locator("h3:has-text('ZARA COAT 3')").isVisible()
   expect(bool).toBeTruthy()
   console.log(productName,":Loaded in cart and its is visible")
   
   await page.locator("text=Checkout").click()
   //await page.locator(".ddl").nth(1).selectOption('22')
   await page.getByPlaceholder('Select Country').pressSequentially("ind")
   const dropdown=await page.locator(".ta-results")
    
   //dropdown.first().waitFor();
   await dropdown.waitFor()
   const optioncount=await dropdown.locator("button").count()

     
   for (let i=0;i<optioncount;++i)
   {
      
      const text= await dropdown.locator("button").nth(i).textContent()
      if(text===' India')
      {
         await dropdown.locator("button").nth(i).click()
         break
      }
   }
     
   await expect(page.locator(".user__name [type='text']").first()).toHaveText(email)
   await page.locator(".action__submit").click()
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
   console.log(orderId)
   
   await page.getByRole('button', { name: 'ORDERS' }).click()
   await page.locator("tbody").waitFor()
   const rowOrderId=await page.locator("  .table .ng-star-inserted").count()
   for (let j=0;j<rowOrderId;++j)
   {
      const id=await rowOrderId.locator("th").nth(j).textContent()
       if(orderId.includes(id))
         {   
      await page.locator(["text=View"]).click()
      break
   }  }
 
   console.log(orderIdDetails,":E2E is complete") 
   const orderIdDetails = await page.locator(".col-text").textContent()
   
   expect(orderId.includes(orderIdDetails)).toBeTruthy()
   
     

   

     

})
