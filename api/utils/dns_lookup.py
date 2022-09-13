import dns.resolver


def get_records(domain):
    """
    Get all the records associated to domain parameter.
    :param domain:
    :return:
    """

    records = {
        'A': [],
        'AAAA': [],
        'CNAME': []
    }

    for a in records:
        try:
            answers = dns.resolver.query(domain, a)
            for rdata in answers:
                records[a].append(rdata.to_text())
        except Exception as e:
            print(e)  # or pass
    return records

def dns_lookup(domain, depth=4, current_depth=0):
    ips = []
    records = get_records(domain)
    ips += records['A']
    ips += records['AAAA']
    if current_depth < depth:
        for cname in records['CNAME']:
            ips += dns_lookup(cname, depth, current_depth)
    return list(set(ips))

