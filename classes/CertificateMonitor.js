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
            let bufPFXData = await fs.readFile(path);
            this.ccAzureCertClient.importCertificate(this.sName, bufPFXData.toString('base64'), { enabled: true, password: this.sCertPass });
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