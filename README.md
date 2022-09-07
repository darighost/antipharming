# Antipharming

I wrote this Chrome extension because me and my colleagues wanted better protection against pharming in the browser.

## What is pharming

>Pharming[a] is a cyberattack intended to redirect a website's traffic to another, fake site by installing a malicious program on the computer. Pharming can be conducted either by changing the hosts file on a victim's computer or by exploitation of a vulnerability in DNS server software. DNS servers are computers responsible for resolving Internet names into their real IP addresses. Compromised DNS servers are sometimes referred to as "poisoned". Pharming requires unprotected access to target a computer, such as altering a customer's home computer, rather than a corporate business server.[citation needed]

## How does this extension work?

By comparing the IP of the site your interacting with to the records on dns.google. This isn't perfect, dns.google often has wierdly outdated records. Soon we'll have a server with dig, but for now this is a proof-of-concept.
