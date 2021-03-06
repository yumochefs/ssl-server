import 'isomorphic-fetch'

export default ({url, token}) => {
    const Fetch = query => fetch(url, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({query})
    })
        .then(res => res.json())
        .then(res => res.data)

    return {
        getAccount({domain, email}) {
            return Fetch(`
                {
                    getAccountKey(domain: "${domain}") {
                        privateKey,
                        email,
                        domain
                    }
                }
            `).then(({getAccountKey}) => getAccountKey)
        },
        setAccount({privateKey, email, domain}) {
            return Fetch(`
                mutation store {
                    storeAccountKey(domain: "${domain}", email: "${email}", privateKey: "${privateKey.replace(/\r?\n|\r/g, "\\n")}") {
                        privateKey,
                        email,
                        domain
                    }
                }
            `).then(({storeAccountKey}) => storeAccountKey)
        },

        getCertificate({domain}) {
            return Fetch(`
                {
                    getCertificateKey(domain: "${domain}") {
                        privateKey,
                        domain,
                        certificate,
                        chain,
                        expiresAt,
                        issuedAt
                    }
                }
            `).then(({getCertificateKey}) => getCertificateKey)
        },
        setCertificate({privateKey, domain, cert, chain, issuedAt, expiresAt}) {
            return Fetch(`
                mutation store {
                    storeCertificateKey(
                                domain: "${domain}",
                                privateKey: "${privateKey.replace(/\r?\n|\r/g, "\\n")}"
                                ${cert ? `, cert: "${cert.replace(/\r?\n|\r/g, "\\n")}"` : ''}
                                ${chain ? `, chain: "${chain.replace(/\r?\n|\r/g, "\\n")}"` : ''}
                                ${issuedAt ? `, issuedAt: ${issuedAt}` : ''}
                                ${expiresAt ? `, expiresAt: ${expiresAt}` : ''}
                                ) {
                        privateKey,
                        domain,
                        certificate,
                        chain,
                        expiresAt,
                        issuedAt
                    }
                }
            `).then(({storeCertificateKey}) => storeCertificateKey)
        }
    }
}