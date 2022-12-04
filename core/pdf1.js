const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./LicenseKey/LicenseKey');
 

'use strict';

exports.pdf2html = (inputFile, outputPath) => {

	const main = async () => { 
		
		try {
			// Convert PDF document to HTML with fixed positioning option turned on (default)
			console.log('Converting PDF to HTML with fixed positioning option turned on (default)');

			// Convert PDF to HTML
			await PDFNet.Convert.fileToHtml(inputFile, outputPath);

			console.log('Result saved in ' + outputPath);
		} catch (err) {
			console.log(err);
		} 
	};

	// 
	return PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function (error) {
		console.log('Error: ' + JSON.stringify(error));
	}).then(function () { return PDFNet.shutdown(); });
};

// eslint-disable-next-line spaced-comment
//# sourceURL=PDF2HtmlTest.js
