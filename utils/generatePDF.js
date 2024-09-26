const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');

const generateBillPDF = async (bill, customer, filePath) => {
  const templatePath = path.join(__dirname, '..', 'views', 'billTemplate.ejs');

  // Render the EJS template with bill and customer data
  const html = await ejs.renderFile(templatePath, { bill, customer });

  // Launch Puppeteer browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content of the page as the rendered EJS HTML
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // Generate PDF
  await page.pdf({
    path: filePath,
    format: 'A4',
    printBackground: true,
  });

  // Close Puppeteer
  await browser.close();
};

module.exports = generateBillPDF;
