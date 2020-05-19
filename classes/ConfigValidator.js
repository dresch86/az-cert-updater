import * as fs from 'fs-extra';

export default class ConfigValidator {
    static async certFileAccessible(certFile) {
        if (!(await fs.pathExists(certFile))) {
            throw new Error('Cert file [' + certFile + '] does not exist');
        }

        return true;
    }
}