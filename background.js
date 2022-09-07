const recursiveDnsLookup = async (domain) => {
    let answers = [];
    // type 5: CNAME
    // type 1: A
    // would also be good to explicitly account for IPv6
    const res = await fetch(`https://dns.google/resolve?name=${domain}`);
    const data = await res.json()
    if (data.Answer) {
        for (const answer of data.Answer) {
            const {type, data} = answer;
            if (type === 5) {
                const newAnswers = await recursiveDnsLookup(data);
                answers = answers.concat(newAnswers);
            } else {
                answers.push(data);
            }
        }
    }
    return answers;
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
            recursiveDnsLookup(domain)
                .then((answers) => {
                    if (!answers) {
                        return
                    }
                    if (!answers.some(answer => answer === ip)) {
                        console.log("it doesnt match!", answers, ip)
                          chrome.storage.sync.set({badGuy: ip}, function() {
                            console.log('Value is set to ' + ip);
                          });
                    }
                });
        }
    }
}, {urls: ["<all_urls>"]});