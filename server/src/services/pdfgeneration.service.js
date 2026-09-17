import puppeteer from "puppeteer";

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "10mm",
      bottom: "8mm",
      left: "8mm",
      right: "8mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

export default generatePdfFromHtml;