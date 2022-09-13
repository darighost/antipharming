from flask import Flask
app = Flask(__name__)

from utils.dns_lookup import dns_lookup

@app.route('/api/dns/<string:domain>')
def get(domain):
    return {
        'ips': dns_lookup(domain)
    }

