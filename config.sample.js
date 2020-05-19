module.exports = {
    azureCfg: {
        tenantId: "azure-ad-tenant-id",
        managedIdClientId: "managed-identity-client-id",
        keyVaultName: "my-key-vault"
    },
    logging: {
        pm2: false,
        level: 'trace',
        path: './test/logs/az-cert-updater.log'
    },
    certificates:
    [
        {
            name: "AzureCertName",
            certPassword: "my-cert-password-no-special-chars",
            certFilePFX: "bundle.pfx"
        }
    ]
}