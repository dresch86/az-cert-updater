# __Azure Certificate Updater__
The Azure Certificate Updater monitors a local certificate file on a VM for changes and updates an Azure Key Vault. This tool is particularly useful for combining Let's Encrypt certficates obtained with the DNS-01 challenge, and making them available to other services such as the Azure Application Gateway without manual intervention.

## __Install Instructions__
### __Requirements__:
* NodeJS
* OpenSSL

### __Setup:__
1. `git clone https://github.com/dresch86/az-cert-updater.git`
2. `cd az-cert-updater`
1. `cp config.sample.js config.js`
1. Edit `config.js` to include Azure credentials and certificate(s) directory and files
1. `chmod 600 config.js`
1. `cp systemd/az-cert-updater.service /etc/systemd/system/az-cert-updater.service`
1. `systemctl enable az-cert-updater.service`
1. `systemctl start az-cert-updater.service`