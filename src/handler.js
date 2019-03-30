'use strict';

const uuid = require('uuid/v4');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const aws = require('aws-sdk');

const exportPdf = async (event, context) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(event.url || 'https://example.com', {
      waitUntil: ['load', 'networkidle0'],
    });

    const buffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    });

    const result = await new aws.S3().upload({
      Bucket: process.env.PDF_BUCKET_NAME,
      Key: `${process.env.PDF_BUCKET_KEY_PREFIX}/${uuid()}.pdf`,
      Body: buffer,
    }).promise();

    return context.succeed({
      path: result.Location,
    });
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = {
  exportPdf,
};
