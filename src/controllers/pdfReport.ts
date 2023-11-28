import puppeteer from 'puppeteer';


export const pdfTest = async (req, res, next) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
   
    await page.setContent('<h1 style="color: red">Hello, Puppeteer!</h1>');
   
    await page.pdf({ path: 'example.pdf', format: 'A4' });
   
    await browser.close();
   
    console.log('Heres your PDF!.');
}
