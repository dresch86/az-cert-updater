import * as fs from 'fs-extra';
import chokidar from 'chokidar';
import * as log4js from 'log4js';

const Logger = log4js.getLogger('AzCertUpdater');

export default class CertificateMonitor {
    sName = null;
    sCertPass = '';
    ccAzureCertClient = null;

    constructor(name, azureCertClient) {
        this.sName = name;
        this.ccAzureCertClient = azureCertClient;
    }

    async updateAzureCertificate(path, stats) {
        try {
            // Cache the old cert for disabling later
            let oldCertificate = await this.ccAzureCertClient.getCertificate(this.sName);

            // Upload the new cert
            this.ccAzureCertClient.importCertificate(this.sName, (await fs.readFile(path)), { enabled: true, password: this.sCertPass });

            // Disable the old cert
            await this.ccAzureCertClient.updateCertificateProperties(this.sName, oldCertificate.properties.version, {
                enabled: false
            });
        } catch (err) {
            Logger.fatal(err.message);
        }
    }

    setCertPassword(password) {
        let sTrimmedPass = password.trim();

        if (sTrimmedPass.length > 0) {
            this.sCertPass = sTrimmedPass;
        }
    }

    monitorCert(certFile) {
        let chWatcher = chokidar.watch(certFile, { persistent: true });
        chWatcher.on('change', (path, stats) => this.updateAzureCertificate(path, stats));
        chWatcher.on('error', error => Logger.error(error));
    }
}