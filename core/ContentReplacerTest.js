//---------------------------------------------------------------------------------------
// Copyright (c) 2001-2022 by PDFTron Systems Inc. All Rights Reserved.
// Consult legal.txt regarding legal and license information.
//---------------------------------------------------------------------------------------


const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./LicenseKey/LicenseKey');

((exports) => {

  exports.runContentReplacer = () => {

    const main = async() => {
      const inputPath = './';
      const outputPath = inputPath + 'Output/';

      try {
        const inputFilename = 'test.pdf';
        const outputFilename = 'oho.pdf';

        const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath + inputFilename);
        doc.initSecurityHandler();

        const replacer = await PDFNet.ContentReplacer.create();
        const page = await doc.getPage(1);
        const img = await PDFNet.Image.createFromFile(doc, inputPath + 'peppers.jpg');

        const region = await page.getMediaBox();
        const replace = await img.getSDFObj();
        await replacer.addImage(region, replace);
        await replacer.addString('NAME', 'John Smith');
        await replacer.addString('QUALIFICATIONS', 'Philosophy Doctor');
        await replacer.addString('JOB_TITLE', 'Software Developer');
        await replacer.addString('ADDRESS_LINE1', '#100 123 Software Rd');
        await replacer.addString('ADDRESS_LINE2', 'Vancouver, BC');
        await replacer.addString('PHONE_OFFICE', '604-730-8989');
        await replacer.addString('PHONE_MOBILE', '604-765-4321');
        await replacer.addString('EMAIL', 'info@pdftron.com');
        await replacer.addString('WEBSITE_URL', 'http://www.pdftron.com');
        await replacer.process(page);

        await doc.save(outputPath + outputFilename, PDFNet.SDFDoc.SaveOptions.e_remove_unused);

        console.log('Done. Result saved in ' + outputFilename);
      } catch (err) {
        console.log(err);
      }
      try {
        const inputFilename = 'newsletter.pdf';
        const outputFilename = 'ContentReplaced.pdf';

        const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath + inputFilename);
        doc.initSecurityHandler();

        const replacer = await PDFNet.ContentReplacer.create();
        const page = await doc.getPage(1);
        const region = await page.getMediaBox();
        await replacer.addText(region, 'hello hello hello hello hello hello hello hello hello hello');
        await replacer.process(page);

        await doc.save(outputPath + outputFilename, PDFNet.SDFDoc.SaveOptions.e_remove_unused);

        console.log('Done. Result saved in ' + outputFilename);
      } catch (err) {
        console.log(err);
      }
      console.log('Done.');
    };
    PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function(error){console.log('Error: ' + JSON.stringify(error));}).then(function(){return PDFNet.shutdown();});
  };
  exports.runContentReplacer();
})(exports);
// eslint-disable-next-line spaced-comment
//# sourceURL=ContentReplacerTest.js
