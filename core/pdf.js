const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./LicenseKey/LicenseKey');
 

((exports) => {
	'use strict';

	exports.runPDF2HtmlTest = () => {

		const main = async () => {

			const inputPath = 'F:\\Extensions\\Nextjs\\test.pdf';
			const outputPath = 'F:\\Extensions\\Nextjs\\';
			
			try {
				// Convert PDF document to HTML with fixed positioning option turned on (default)
				console.log('Converting PDF to HTML with fixed positioning option turned on (default)');

				const outputFile = outputPath + 'z';

				// Convert PDF to HTML
				await PDFNet.Convert.fileToHtml(inputPath, outputFile);

				console.log('Result saved in ' + outputFile);
			} catch (err) {
				console.log(err);
			} 
		};

		// 
		PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function (error) {
			console.log('Error: ' + JSON.stringify(error));
		}).then(function () { return PDFNet.shutdown(); });
	};
	exports.runPDF2HtmlTest();
})(exports);
// eslint-disable-next-line spaced-comment
//# sourceURL=PDF2HtmlTest.js
