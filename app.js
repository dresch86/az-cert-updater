import * as log4js from 'log4js';
import * as appCfg from './config';
import { ManagedIdentityCredential } from '@azure/identity';
import { CertificateClient } from '@azure/keyvault-certificates';

const vaultName = appCfg.azureCfg.keyVaultName;
const managedIdentityClientId = appCfg.azureCfg.managedIdClientId;

const Logger = log4js.getLogger('AzCertUpdater');
log4js.configure({
    appenders: { main: { type: 'file', filename: appCfg.logging.path } },
    categories: { default: { appenders: ['main'], level: appCfg.logging.level } },
    pm2: appCfg.logging.pm2
});  

(async () => {
    const url = `https://${vaultName}.vault.azure.net`;
    const credential = new ManagedIdentityCredential(managedIdentityClientId);

    const client = new CertificateClient(url, credential);
    const cert = await client.getCertificate("LetsEncryptWildcard");
    console.log(cert);
})()
.catch(err => {
    Logger.fatal(err.message);
})
.finally(() => {
    Logger.info('AzCertUpdater exited');
});