# NOTE
The repo must already exist on the host server because the build script must exist

# NOTE
Also ensure that the repo is cloned with an ssh profile that doesn't require a password for pull actions
One way to accomplish this is to use a deploy key and set up an ssh profile on the server that looks something like this:
```
Host github.com-capstone-repo
	Hostname github.com
	IdentityFile ~/.ssh/id_ed25519_github_capstone_repo
```
Using a config like that, the clone command would be `git clone git@github.com-capstone-repo:Bennett-Wendorf/NeuraViz.git`

# Secrets
The following secrets need to be set in the repository settings:
```bash
SSH_HOST='<ip of host to connect to>' # This combined with the SSH User is what you'd normally type in. For example, if you'd normally type `ssh root@localhost`, then this would be `localhost`
SSH_KEY='<Public key of keypair that was generated on host server>'
SSH_PORT='22' # This is almost always going to be 22, but I included it here anyway
SSH_USER='<The name of the user to connect to ssh with>' # This combined with the SSH host is what you'd normally type in. For example, if you'd normally type `ssh root@localhost`, then this would be `root`
WIREGUARD_ALLOWED_IPS='<The range of allowed IPs>' # The host part of the IP MUST be 0. E.g.: 123.255.0.0/16
WIREGUARD_ENDPOINT='<The wireguard endpoint>' # This should be the host and port of the wireguard server. E.g.: 123.255.25.12:51820 OR subdomain.example.com:51820
WIREGUARD_IPS='<The ip to assign the client upon connection>'
WIREGUARD_ENDPOINT_PUBLIC_KEY='<The public key of the wireguard endpoint>'
WIREGUARD_PRIVATE_KEY='<The private key of the wireguard client>'
```
