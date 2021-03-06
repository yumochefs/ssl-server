// @flow
export type ApiType = {
   getAccount: Function,
   setAccount: Function,
   getCertificate: Function,
   setCertificate: Function
}

type AccountOptions = {
   email: String,
   domains: Array<String>,
   pems: Pems
}

type RegistrationResult = {
   keypair: String,
   receipt: String
}

type Pems = {
   privkey: String,
   cert: String,
   chain: String,
   issuedAt: Number,
   expiresAt: Number
}

export default (api: ApiType, logger: Object) => {
   const {getAccount, setAccount, getCertificate, setCertificate} = api

   return {
      accounts: {
         checkKeypair(opts: AccountOptions, cb: Function) {
            logger.info("SSL: Checking for account privateKey")

            getAccount({domain: opts.domains[0]})
               .then(account => {
                  if (account) return cb(null, {privateKeyPem: account.privateKey})
                  cb(null)
               })
               .catch(e => {
                  logger.error("error on lookup for ssl account privateKey", e)
                  cb(null)
               })
         },
         setKeypair(opts: AccountOptions, keypair, cb: Function) {
            logger.info("SSL: Setting account privateKey")

            setAccount({domain: opts.domains[0], email: opts.email, privateKey: keypair.privateKeyPem})
               .then(account => {
                  if (account) return cb(null, keypair)
                  cb(null)
               })
               .catch(e => {
                  logger.error("error setting ssl account privateKey", e)
                  cb(null, keypair)
               })
         },

         check(opts: AccountOptions, cb: Function) {
            logger.info("SSL: Checking account privateKey")

            getAccount({domain: opts.domains[0]})
               .then(account => {
                  if (account) return cb(null, {
                     keypair: {privateKeyPem: account.privateKey},
                     domains: [account.domain]
                  })
                  cb(null)
               })
               .catch(e => {
                  logger.error("error on lookup for ssl account privateKey", e)
                  cb(null)
               })
         },
         set(opts: AccountOptions, reg: RegistrationResult, cb: Function) {
            logger.info("SSL: Setting account receipt")

            const res = {
               email: opts.email,
               keypair: reg.keypair,
               receipt: reg.receipt
            }

            setAccount({domain: opts.domains[0], email: opts.email, privateKey: reg.keypair.privateKeyPem})
               .then(account => {
                  if (account) return cb(null, res)
                  cb(null, res)
               })
               .catch(e => {
                  logger.error("error setting ssl receipt", e)
                  cb(null, res)
               })
         }
      },
      certificates: {
         checkKeypair(opts: AccountOptions, cb: Function) {
            logger.info("SSL: Checking for certificate privateKey")

            getCertificate({domain: opts.domains[0]})
               .then(certificate => {
                  if (certificate) return cb(null, {privateKeyPem: certificate.privateKey})
                  cb(null)
               })
               .catch(e => {
                  logger.error("error on lookup for ssl privateKey", e)
                  cb(null)
               })
         },
         setKeypair(opts: AccountOptions, keypair, cb: Function) {
            logger.info("SSL: Setting cert privateKey")

            setCertificate({domain: opts.domains[0], privateKey: keypair.privateKeyPem})
               .then(certificate => {
                  if (certificate) return cb(null, keypair)
                  cb(null)
               })
               .catch(e => {
                  logger.error("error updating ssl privateKey", e)
                  cb(null, keypair)
               })
         },

         check(opts: AccountOptions, cb: Function) {
            logger.info("SSL: Checking for certs")

            getCertificate({domain: opts.domains[0]})
               .then(certificate => {
                  if (certificate) {
                     if (certificate.cert && certificate.chain) return cb(null, {
                        privkey: certificate.privateKey,
                        domains: [certificate.domain],
                        cert: certificate.certificate,
                        chain: certificate.chain,
                        expiresAt: certificate.expiresAt,
                        issuedAt: certificate.issuedAt
                     })
                  }
                  cb(null)
               })
               .catch(e => {
                  logger.error("Failed to query for certs", e)
                  cb(null)
               })
         },
         set(opts: AccountOptions, cb: Function) {
            logger.info("SSL: saving certificates")

            const pem: Pems = opts.pems
            setCertificate({
               domain: opts.domains[0],
               privateKey: pem.privkey,
               cert: pem.cert,
               chain: pem.chain,
               issuedAt: pem.issuedAt,
               expiresAt: pem.expiresAt
            })
               .then(certificate => {
                  if (certificate) return cb(null, opts.pems)
                  cb(null)
               })
               .catch(e => {
                  logger.error("Could't set cert", e)
                  cb(null, opts.pems)
               })
         }
      },

      getOptions() {
         return {}
      }
   }
}