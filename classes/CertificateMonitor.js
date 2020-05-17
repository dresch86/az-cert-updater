import chokidar from 'chokidar';
import * as log4js from 'log4js';

const Logger = log4js.getLogger('AzCertUpdater');

export default class CertificateMonitor {
    sName = null;
    sCertPass = '';
    oCertFiles = {};
    aCommandArgs = [];
    ccAzureCertClient = null;

    constructor(name, azureCertClient) {
        this.sName = name;
        this.ccAzureCertClient = azureCertClient;
    }

    async updateAzureCertificate() {
        try {
            let blPEMtoPFXOutput;

            if (this.sCertPass.length > 0) {
                let oCmdEnv = {
                    env: {
                        'PFX_PASSWORD': this.sCertPass
                    }
                };

                blPEMtoPFXOutput = await spawn('openssl', this.aCommandArgs, oCmdEnv);
            } else {
                blPEMtoPFXOutput = await spawn('openssl', this.aCommandArgs);
            }

            if (!(blPEMtoPFXOutput instanceof Error)) {
                this.ccAzureCertClient.importCertificate(this.sName, blPEMtoPFXOutput.toString('base64'), { enabled: true, password: this.sCertPass });
            } else {
                Logger.error(blPEMtoPFXOutput.stderr.toString('utf8'));
            }
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

    monitorCert(certDir, certFiles) {
        this.oCertFiles = certFiles;
        this.aCommandArgs = ['pkcs12', '-export'];

        if (this.oCertFiles.hasOwnProperty('cert')) {
            this.aCommandArgs.push('-in', this.oCertFiles.cert);
        }

        if (this.oCertFiles.hasOwnProperty('chain')) {
            this.aCommandArgs.push('-certfile', this.oCertFiles.chain);
        }

        if (this.oCertFiles.hasOwnProperty('privateKey')) {
            this.aCommandArgs.push('-inkey', this.oCertFiles.privateKey);
        }

        if (this.sCertPass.length > 0) {
            this.aCommandArgs.push('-passout', 'pass:$PFX_PASSWORD');
        }

        let chWatcher = chokidar.watch(certDir, { persistent: true });
        chWatcher.on('change', () => this.updateAzureCertificate());
    }
}