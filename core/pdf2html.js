const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./LicenseKey/LicenseKey');
 

'use strict';

exports.pdf2html = (inputFile, outputPath) => {

	const main = async () => { 
		
		try { 
			
			await PDFNet.Convert.fileToHtml(inputFile, outputPath); 

		} catch (err) {
			console.log(err);
		} 
	};

	return PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function (error) {
		console.log('Error: ' + JSON.stringify(error));
	}).then(function () { return PDFNet.shutdown(); });
};
 
