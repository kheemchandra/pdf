//---------------------------------------------------------------------------------------
// Copyright (c) 2001-2021 by PDFTron Systems Inc. All Rights Reserved.
// Consult legal.txt regarding legal and license information.
//---------------------------------------------------------------------------------------

//"Enter your key here. If you don't have it, please go to https://www.pdftron.com/pws/get-key to obtain a demo license or https://www.pdftron.com/form/contact-sales to obtain a production key.
const LicenseKey = 'demo:ashudhanik00@gmail.com:7a8b85200200000000a1f941a48ba68783e9a31623a5631be4005a7a4c';
if(LicenseKey == 'YOUR_PDFTRON_LICENSE_KEY'){
    throw ('Please enter your license key by replacing \'YOUR_PDFTRON_LICENSE_KEY\' that is assigned to the LicenseKey variable in Samples/LicenseKey/LicenseKey.js. If you do not have a license key, please go to https://www.pdftron.com/pws/get-key to obtain a demo license or https://www.pdftron.com/form/contact-sales to obtain a production key.');
}
exports.Key = LicenseKey;
