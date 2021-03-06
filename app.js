import * as log4js from 'log4js';
import * as appCfg from './config';

import ConfigValidator from './classes/ConfigValidator';
import CertificateMonitor from './classes/CertificateMonitor';

import { ManagedIdentityCredential } from '@azure/identity';
import { CertificateClient } from '@azure/keyvault-certificates';

const vaultName = appCfg.azureCfg.keyVaultName;
const managedIdentityClientId = appCfg.azureCfg.managedIdClientId;

log4js.configure({
    appenders: { main: { type: 'file', filename: appCfg.logging.path } },
    categories: { default: { appenders: ['main'], level: appCfg.logging.level } },
    pm2: appCfg.logging.pm2
});  

const Logger = log4js.getLogger('AzCertUpdater');

(() => {
    let url = `https://${vaultName}.vault.azure.net`;
    let micCredentialHandler = new ManagedIdentityCredential(managedIdentityClientId);
    let ccCertClientRes = new CertificateClient(url, micCredentialHandler);

    appCfg.certificates.forEach(async (certificateMonitored) => {
        try {
            if (await ConfigValidator.certFileAccessible(certificateMonitored.certFilePFX)) {
                let cmCertMonitor = new CertificateMonitor(certificateMonitored.name, ccCertClientRes);
                cmCertMonitor.setCertPassword(certificateMonitored.certPassword);
                cmCertMonitor.monitorCert(certificateMonitored.certFilePFX);
            } else {
                throw new Error('Invalid certificate file path(s)');
            }
        } catch (err) {
            Logger.fatal(err.message);
        }
    });
})()