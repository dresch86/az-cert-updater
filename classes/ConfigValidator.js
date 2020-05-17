import path from 'path';
import * as fs from 'fs-extra';

export default class ConfigValidator {
    static async certFilesExist(certCfg) {
        if (certCfg.certFiles.hasOwnProperty('cert')) {
            let sCertPath = certCfg.certDir + path.sep + certCfg.certFiles.cert;

            if ((certCfg.certFiles.cert.length < 1) || !(await fs.pathExists(sCertPath))) {
                return false;
            }
        }

        if (certCfg.certFiles.hasOwnProperty('chain')) {
            let sChainPath = certCfg.certDir + path.sep + certCfg.certFiles.chain;
            
            if ((certCfg.certFiles.chain.length < 1) || !(await fs.pathExists(sChainPath))) {
                return false;
            }
        }

        if (certCfg.certFiles.hasOwnProperty('privateKey')) {
            let sPrivateKeyPath = certCfg.certDir + path.sep + certCfg.certFiles.privateKey;
            
            if ((certCfg.certFiles.privateKey.length < 1) || !(await fs.pathExists(sPrivateKeyPath))) {
                return false;
            }
        }

        return true;
    }
}