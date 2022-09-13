const checkDomainIp = async (domain, ip) => {
    const res = await fetch(`https://antipharming.pythonanywhere.com/api/dns/${domain}/${ip}`);
    const data = await res.json()
    return data.found
}

chrome.webRequest.onResponseStarted.addListener((data) => {
    const ip = data.ip;
    const url = data.url;

    if (data.initiator || ip.startsWith('8.8.' ) || url.includes('dns.google')) {
        // this is a fetch to Google's nameservers
        // to verify a domain, ignore
        return
    }
    const regex = /\/\/([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g;
    const domainMatch = regex.exec(url);
    
    if (domainMatch) {
        if (domainMatch.length > 1) {
            const domain = domainMatch[1];
            checkDomainIp(domain, ip)
                .then(found => {
                    if (!found) {
                        chrome.storage.sync.set({badGuy: ip}, function() {
                            console.log('Value is set to ' + ip);
                        });
                    }
                });
        }
    }
}, {urls: ["<all_urls>"]});