# Bit Pay Code Challenge:
## Signed Message Sender Client & Server

##Testing Instructions
Clone repo, run `npm install` at root of repo. If your machine doesn't have electron installed as a global npm package, also run `npm install -g electron' and make sure your terminal of choice can run the `electron` command. Run `node server/app.js` to start the server. Run `electron client/app.js` to start the client.

## Server Piece
The server was written in node.js and primarily relied on express and moongoose. It set up a rest based service with different routes that could be hit from the client in order to perform specific actions. The server stored its information on a cloud-based mongoDB instance, provided by mongoDB's Atlas service. This helped abstract away some of the database security. Note, for the purpose of this challenge, the DB is configured to accept connections from any/all IPs, to help facilitate running this test on not my local machine. In reality, the server would only whitelist the IP of production servers deployed with this code.

This server uses the bcrypt package to hash and salt the passwords stored on the database. It uses the openpgp package to generate keys, sign messages, and verify signatures. It uses the helmet and validator packages to help sanitize incoming requests and request headers.

One of the apparent issues is the connection string being in a visible config file. In production, the connection string would have been stored as an environment variable during the deployment process. The first part of the envVariables.js would have then picked it up from there and pushed it through to the program, as to abstract it away from the source code.

The main process of the server app reads in requests and routes them to the proper channel. There are 2 main functions which have been left uncommented in the current code. (There are several functions I used for testing that are commented out in the source code. In production, these would be deleted, but I left them in to show a bit of the process I used while coding.)

### `POST http://localhost:3000/insertUserKey`
This is a post endpoint that requires three pieces in the body of the request, submitted as an x-www-form-urlencoded type
- `username` \- the username of the account
- `password` \- the password of the account
- `key`\- the public key the user wants to store
If the password is correct for the username, the key will be updated in the database. It will update even if there is already a key associated with the account, effectively overwriting the old key.

### `POST http://localhost:3000/insertSignedMessage`
This is a post endpoint that requires three pieces in the body of the request, submitted as an x-www-form-urlencoded type
- `username` \- the username of the account
- `password` \- the password of the account
- `message`\- the signed message to be verified and stored if successfully verified.
If the password is correct for the username, the message will be verified against the key on record for the account. If the verification is validated, the full signed message will be stored with the account.

## Client Piece
The client was written in node.js and used the electron package and some HTML to make a basic GUI. The GUI has a simple file browser to pull a private key in from a text file, or it can be copy-pasted into the box. Otherwise, the user needs to input their username, password, and the message they want to submit. After clicking the submit button, a status message will appear to give the user information about their messages status.

The client then sends a POST request to the server where it is authenticated and the message is verified. The GUI as it stands is only made to interact with the `insertSignedMessage` endpoint. To insert a user key, you will need to use a tool like Postman to send a post request to the correct URL. Also in the source code is a function for creating users on the database. I did not fully secure/authenticate that method, as I intentionally did not leave it in the finished project (it would be left out of the deployment build). It can be uncommented, however, in order to test with new accounts rather than the ones I provide.

## Testing Accounts
There are three accounts currently fully-enabled with keys on the database.
1. First Account
   - Username \- steven
   - Password \- 1234
   - Private Key \-
   
```
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

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
vqbJzbuQhUb+bt5MOkgC6RtiiiJlig==
=e7Eh
-----END PGP PRIVATE KEY BLOCK-----
```

   - Public Key \-
   
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

xsBNBFrCPzYBB/97ebTlvhHkNc76Ya7DS9Nr5qHOHFZL8tVtwZDxHrDNRf7R
CJhPEtIga5lfGOJHza4hucH4fjASfgC+RqDcwrdihm8bvRuqSKDifGbx3E13
Vae76AZiPDIpqHrNbdi68PajH+jcEp9aDm8aVRzilFp9UYdQgtl2HNC9clg/
5zLRje52C2vCZG6OLdmgzNdxMSmNsmWmn6Rirb9lhL8NhyIeJPuUHX6zlggI
eAvLHu2tSDYVe9eo9zkXt6lWgtxxNGwSlQKaBvQNaK1s+6lyYW9Ow8yQFfV2
7grkaF95h13ogWZ917z/zTJSNFwCJoFgCIuk5zMQHqnFeiZhcOF21Q9FABEB
AAHNAjw+wsB1BBABCAApBQJawj9ABgsJBwgDAgkQjOtbUEyRjZ4EFQgKAgMW
AgECGQECGwMCHgEAAB6hB/sHa2nCipvWnWdJdcA7P9QZ8eIKXKkvVEyGeBk3
HAKdgw/ughOLd8vYnW1JtRbqnKmR4wiM0BeB6Eu2xZlNo1etVlWZmq7IWDaU
usoO6blpmTfRRZS4gqLQ/dpBD0yZR29a/KbDVC5FAMrnBikqGgby7CaQhZXM
CkzYioNZ2LcUyCNtbdvaNjzpIzEZNjzkQa+Rr7xfbF3HiIjGzaRKTLL7dPeo
TIT3FF/vKjCzwS6+u9fMEivH4F0nDx6WeTKXbwwwpWXZDwN9HOQg9vNd3EGI
clrzblc5yR0SvdaxHNjTfcaYemGbn46ITm0gLutcJ/+6L4QR9FuaoUJsShs1
nn5HzsBNBFrCPzYBCACeqyANNC9ID2dAj1QvkSmIcd7XGevPue8k7jOiaKSq
pb1bMeMhiDAaaGi/cRNZGHygjXbjs+nV1o2V6zhsTrHzuxQXB3Hmc6TAuJdE
n34a4BBgVIUn5ET+a8tb+CgGbYMZqpsfRZ6PTf8OESS0UCx2E0P4+f2HqEuh
wwCdZPnizVCF7thXPLkvg2UbmruXFLhX+WYLrOXoN8ZntWaiQLUC2SVLsWue
hYAHp3eqJppcN1ddqvPvtK0T1scKl8Ae9mTQGn597wM73dQnH2Hyt3+z2M2U
9hdqryLKJpIUBu2W3qKe93Eyb9PfjmYMaGq4taeIE9VXt+fEhValQ6Bnsic/
ABEBAAHCwF8EGAEIABMFAlrCP0EJEIzrW1BMkY2eAhsMAAB4Lgf+OB+Qj15U
hwjQcNJgBgrFdQT+X3FEtpz2k3PhK8YP/1ifgvne6BnUPr8JLjP1QOCsJ7G6
OHZhP7BZq3UopeTjqfMF98t0ECvIJOnsyvH3faXutOn/Ml7sNt8mlJHaxcSY
fM9CCKLviTieo0WA50+8roY4lgz1LFz3lC7nIHmE8nKameztuGGC+2hnAAKA
A1ghjw2hCWxAjmwES0tZ+lbleuYcznnAntQS55NjSfeitUEWAWaUfGIrzToB
T4udgynQSjtBQKy4T9IrTHL1OcX/L1JC+nEO54LdIUJLkE/7ZTKXEK/nii1y
B0ImvqbJzbuQhUb+bt5MOkgC6RtiiiJlig==
=v7NC
-----END PGP PUBLIC KEY BLOCK-----
```

2. Second Account
   - Username \- steven2
   - Password \- 1234
   - Private Key \-
   
```
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

xcLYBFrBrg0BB/9yeDWckNT1iPL7bZtvxqjp94lrFbypHQdmIc32VyE0ByeN
d2HTcynejQ3w/IvI2MGyZZrY2tjjhEgn3za7dP9q2n/7Oww7HE5ncE+pKz4q
1Uo7M13YFmDwcV1S1GKujb3T0xY0pvgWrbNy1r2u8q770GVauIBVx8quRz7j
PYEshkdfdFXubtH/rNCaPeDvx0aQqUZsSH5HCTyqbP9oabdJjaYt5HfmOy2O
AKIB4C+QeGYtGbz+4hoY7tcn9ckDM2/cx3CA/qW9vLWFGPBVwuH//5AX6SNY
KUJBBwiFErcyaaVWnv+xTeGfvCKpyt1AIhe86zM+sPEhjBHv8L69SFvzABEB
AAEAB/9aYbPi9TBQ1lsUTszmCrOgWMT1+mnGFZeb+qEHGnCrBeMi/doN/OZY
RIN3fdBZO1xlIXiMNO//ZJkcclBi3tQ1aGSY11ym54i4f6NGbVBevZ4o9Dvq
vHC6KKiJGAz6ygvSTt8/n35PWcNQr2GB2zhyt27vnLIoCOJtjO+IuS1fG2ma
bfrSdGam46zwQxOXNNZ4t7drrTrj4hJBVgkrnj2f4fjaH/rJ6scfKaLDR/yr
HFSLnjmkNOp23rvyMXPxWtTICtPxapyPshcPOpllFmPLDqDvZliVF3uD/Ug2
0T+D+3PK4VzbByaGKSXmpO8+7sB5XwuPP7vY/d+DMXkXwQWBBADXNyr/xvxa
ofklEa8+kJf0MQfPwIbeCReRyIr+4RUAcMUV+celUHIIUfbBY5XLJ07nIOJi
8QWqwd8JRve4jrPThNFQsOxQcV6WVd8BePUjJGOSS/CycNz77/oa2+5talLY
R5Pci4nvBYz7iDtsJ+63SsW+oNotivGg7Tdzpjpg0wQAiCmD9IXnWq933l8g
/oSLV5IDM1oS/EjsEQkzul5Z0tPq2BOdb71dpYlewK8tQNMlmXxs/lH7WhPx
B0Cdnz+PJPZasR85iQZwq5SoBqFwFwKzSv5OqWJOTM9cCyzrTeG4jBmOPZLh
u3a2zlG4+C9BPencr9fu1PWci+YI6a7EJGED/3CB5DM6zAbAdoq3SAXDpgIt
vvCvv/DVDQu7JFV2fGoR2B9ITG08RCI66Weu5sNREGaXmZFmoO50E86OoWVD
AXhzrdJBFv7WqJl7uVkyYvmWnkC6zJc388yTlF1avTc0Q2BTcWPa9mRuKUG5
5x67uPiQ+gdpDEog3H88/gq5FOsqTwfNAjw+wsB1BBABCAApBQJawa4XBgsJ
BwgDAgkQGZH604fXOrEEFQgKAgMWAgECGQECGwMCHgEAAOfPB/9lqCrmEq0t
k/IjU+DMQVxhIgr+TDHWaOceGhqeJX+Nn24hTEfFrlX/8MBcX/rESV6C53CZ
XZvO8OmMWjCrq+bJ6jPImRAo2VBXrq9zvt+4d5eSKrOO4UzpbXzaJtkqFXLn
lcrEa26n7ME2+ZzYTpuM14uqsfVd+bY7PK9OIbEo7z0YRzjKkAnAuMymjIRv
ZYUW1wsEv6ix+2q0mv3KqdTwBaEiX8ZKbef8mSPGFIPSKr3EQtTDT24TI3g3
lisJvUaUkPA3e2wHr4VejP1lgWcwbBUpQ5ptc5+RJg/sDd9jMZs8YBdB9ICp
5hsh4CuRPJ4HSw2O0bYbDRHBzitK8GUAx8LYBFrBrg0BCACMulkdlDikN6yY
gSHi0hMV+NccdIYyEl9UpqT6KQa3lWXeecA85/u+uTgy3bVsqBLoXsYVRMyn
PGT6k0oY1b0ITOnsZAdR0RQ+b4IapIgDS4oCjbIO9Q+V7OCWRpVvb+bkny4e
9ajsQCE2fEuGmalNhhrZS3Tn9OBy1xKGuuPO5Y4JbcQYCu2zQJsMwoceC0qA
4sR0SlwquxualwgTyPfyqlm3JeZVBiZmgQfhDvk+S+SAQ1761Ubcbmwp30rR
aVzOI0ho/iqU6T1OZdTHRjFRG2UttXm9u93taITplz/408KzXQ4tjBDCpRVq
RJz4RBUotzAN4VXDtFirg1rZeynJABEBAAEAB/9wD7gE+NG92uOisTmln/k4
xuWssBFob/7frq+y0Nabe+kZpsPw/B4Yeu+IecoNky0zQrzjlNyO02Xprz4S
1qjnoi+oYOL/QMmpCiyFQL1aOl3UuLaweG6HyY/xupUmnuoy5ZrZZm+0aUDJ
XWLa9SO/KunYXODkELhmWmNTTCE5z5u1iyGLnJbtw2YNuapavDTbiEil/fqe
oFzD5XmFOHAEpgsIeNdoqnA/2j/FQaCTVZzou6lqA5QxZqi03iDM9LIhlCZA
ePSPP1If23++JgdCoxthp9OyrdJ87EPmm6shtC6cpNmLWxuVB9fYr5iS9UaT
TTBQF8DK6O+5x/5YIjHtBADWHqq0q5IeRbq4gsnjnG3vfGM7l+ruM3vbXNxR
JYYX+vnWBBZTzSaxWU0UtNqEGYkOpJVv8uv1HUirTmOPKQHu6F54Jzoey/Xs
okCigP5tj0yRxXYpDsy85vpt2ZBIkVXfgsWBai297whqbB+PZf2qI4TUTVok
TZIXRxbuEsUAUwQAqEDUIDYdNptm5K1XP9w3H5Mkhe5RlVp+c16FYXC08Jd1
koGmI/MuF3+ibpYIaFhy4CXlWETRPM4ytUSkWMYMz4x4B5AJMqPSYNH82KJi
y+lajpwRPJaTeFkZAFJWCxfFn32hLaVPROE49Kt4o+9cgm+fDhF1KVCv4c+t
aBdFWfMEAJq7ufHf7aIKMnA+HIwt8wiYZg/nbaaHvcOYEVpBc0/uVpxzjrSf
zPCfyLFM8L5+J+OwtydE9rSifb1+GQs8ORixxTAV18m7WPfV9fqblOYyaOTo
HDIRecTrHoGjQINpogI6SSLAqW2Fr3CRxZDvNxB+RFX9Rm7bK8bJXBCiwcsn
Te7CwF8EGAEIABMFAlrBrhcJEBmR+tOH1zqxAhsMAAC9mwf9GNuefJNDBfLu
i/FBl5a52bhva4nEunhqI6heh/KEzVYRp2keZ6m3VrCisr6jCSt4eqCbwEds
pIAMf3eM0iJzM2tosRXLnic/vPVPLyLrexZNi48Xx9lN636t05rLuT8JbtVe
CbmXARv4V4aDJ0zv96bPBKIuY5n3A2Ucjs81b98OziAhG/JE3BhdFbWzemFB
mdvFqVnHQY6jgVXj7xAU+bC6glrbfc176SjhGNC0eZyDaSUJypTQfUQi7L37
MVLpvE/mZS45OZiYX5dhWCyn+gi/T8QUTZBqNMy7asiK1KKct+BhPyS3V+sU
UMHdFy9Y53W4tuOCPAU7nxYXHAIH0w==
=cvtB
-----END PGP PRIVATE KEY BLOCK-----
```

   - Public Key \-
   
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

xsBNBFrBrg0BB/9yeDWckNT1iPL7bZtvxqjp94lrFbypHQdmIc32VyE0ByeN
d2HTcynejQ3w/IvI2MGyZZrY2tjjhEgn3za7dP9q2n/7Oww7HE5ncE+pKz4q
1Uo7M13YFmDwcV1S1GKujb3T0xY0pvgWrbNy1r2u8q770GVauIBVx8quRz7j
PYEshkdfdFXubtH/rNCaPeDvx0aQqUZsSH5HCTyqbP9oabdJjaYt5HfmOy2O
AKIB4C+QeGYtGbz+4hoY7tcn9ckDM2/cx3CA/qW9vLWFGPBVwuH//5AX6SNY
KUJBBwiFErcyaaVWnv+xTeGfvCKpyt1AIhe86zM+sPEhjBHv8L69SFvzABEB
AAHNAjw+wsB1BBABCAApBQJawa4XBgsJBwgDAgkQGZH604fXOrEEFQgKAgMW
AgECGQECGwMCHgEAAOfPB/9lqCrmEq0tk/IjU+DMQVxhIgr+TDHWaOceGhqe
JX+Nn24hTEfFrlX/8MBcX/rESV6C53CZXZvO8OmMWjCrq+bJ6jPImRAo2VBX
rq9zvt+4d5eSKrOO4UzpbXzaJtkqFXLnlcrEa26n7ME2+ZzYTpuM14uqsfVd
+bY7PK9OIbEo7z0YRzjKkAnAuMymjIRvZYUW1wsEv6ix+2q0mv3KqdTwBaEi
X8ZKbef8mSPGFIPSKr3EQtTDT24TI3g3lisJvUaUkPA3e2wHr4VejP1lgWcw
bBUpQ5ptc5+RJg/sDd9jMZs8YBdB9ICp5hsh4CuRPJ4HSw2O0bYbDRHBzitK
8GUAzsBNBFrBrg0BCACMulkdlDikN6yYgSHi0hMV+NccdIYyEl9UpqT6KQa3
lWXeecA85/u+uTgy3bVsqBLoXsYVRMynPGT6k0oY1b0ITOnsZAdR0RQ+b4Ia
pIgDS4oCjbIO9Q+V7OCWRpVvb+bkny4e9ajsQCE2fEuGmalNhhrZS3Tn9OBy
1xKGuuPO5Y4JbcQYCu2zQJsMwoceC0qA4sR0SlwquxualwgTyPfyqlm3JeZV
BiZmgQfhDvk+S+SAQ1761Ubcbmwp30rRaVzOI0ho/iqU6T1OZdTHRjFRG2Ut
tXm9u93taITplz/408KzXQ4tjBDCpRVqRJz4RBUotzAN4VXDtFirg1rZeynJ
ABEBAAHCwF8EGAEIABMFAlrBrhcJEBmR+tOH1zqxAhsMAAC9mwf9GNuefJND
BfLui/FBl5a52bhva4nEunhqI6heh/KEzVYRp2keZ6m3VrCisr6jCSt4eqCb
wEdspIAMf3eM0iJzM2tosRXLnic/vPVPLyLrexZNi48Xx9lN636t05rLuT8J
btVeCbmXARv4V4aDJ0zv96bPBKIuY5n3A2Ucjs81b98OziAhG/JE3BhdFbWz
emFBmdvFqVnHQY6jgVXj7xAU+bC6glrbfc176SjhGNC0eZyDaSUJypTQfUQi
7L37MVLpvE/mZS45OZiYX5dhWCyn+gi/T8QUTZBqNMy7asiK1KKct+BhPyS3
V+sUUMHdFy9Y53W4tuOCPAU7nxYXHAIH0w==
=xwsy
-----END PGP PUBLIC KEY BLOCK-----
```

3. Third Account
   - Username \- steven3
   - Password \- 4321
   - Private Key \-
   
```
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

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
PPgrxzIGPzrIQkq8GHMQ5eT6bEsb7A==
=0YQO
-----END PGP PRIVATE KEY BLOCK-----
```

   - Public Key \-
   
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v3.0.3
Comment: https://openpgpjs.org

xsBNBFrC4awBCACW2AkGpmA3SEgYZe4qil+NCTHW9P4HrPZSt+i5DgsYg0wc
zym+BegS3ZZ4NaOqwo60wtHsQ6S/vvWEA3pLnt6sK7lEpLyUHnsTYsiedPyg
D4aaGgmRHQLzLHCq5nV7bofY4tFZJxGNfa8XKnrK3Nok6+zSqB9MD32BUeR9
zcLsHutAypiW+WhQ8heEN9eIyLprtmAG3FkVAx/wdX1RL2E3ab8EqXPQ04Gu
5hTWA6tNFwDNIDrEfTMYe0IfbTKImM7nH2H4dLa5m9GbsPglvSCg1WiX4SCU
Rus2peAWO35c3cxYYEnxvZORd7tm2N7g/LdnlrdSjhZxWtrVPjAKRsf5ABEB
AAHNAjw+wsB1BBABCAApBQJawuGzBgsJBwgDAgkQQqh3SmsJWUkEFQgKAgMW
AgECGQECGwMCHgEAAGpMCACLi9E9yjVEcCnrLyVssuZ+WMuu3Ds9eJgCiOyx
KKqL8bxl93P2KzG20luhTJi5PosEtpOU1yKbILuBZgRM3EfOy6NlGJQIZMXF
5Wwz3/zy65XEJVUMHsoMGChRV405Wrbk8+PiayvLjpj7oB5YZ0mpGJdn4Zzi
46pCmYGRpFDwOZviu53Or0JwpgwaxASJNBKSMTlaHmAQUh7s4iZ0JZ0v2bVy
yHqosK7qR/5i3pZUV1TTkZ95STVYu0zeuk2Mj0BRDKIkDfXYAanot1s85wDY
nizg6UB4xMztl3DRkHG28TLTUU25PCmjp1/irE3JGffSjirqOw+J4O4K+ugM
WNQHzsBNBFrC4awBCACLo8tDIaBPq2Nu/liur5ZFMdSfDS5haFvLa5a+krFq
TgdAl85lSvyj+KQcB7hjbfc7aSauOTA08lYYJPjo4QQUl58cA2hXBKde9ux2
npkDYBCrS5qUYjhMfGD+F+0DzXW7ujlbiA2XRuP8RS1lHT23myvaM3wEP39a
6TSGFoAwQ9iYo4Vzgzr9cEp0/ctNzGDtJ9ueR/eHxwblkTJ1BQYIkcZZZ1Ct
3GmOY/wmMlCcd38Mjjt/rENxdNwoi0Znm85FEI7wgBCtomWYQ4sBjPVltVu5
NykdnzwBSdFrVbHxGzfVGo5Iy4g4VTuL9KpbxbKd//U/hi9ugOKYw4s9em6T
ABEBAAHCwF8EGAEIABMFAlrC4bMJEEKod0prCVlJAhsMAAB0OQf/SO7/xKaL
k3RD5qaIjPJFDQ2ETSNDa2Pq0CHB9fWpvnfvDWDG6T58sRjUQtG/rDd6Jci/
bPgDWJKbrer+fpOaWD3yjzDpVuUaSF+1/NirT6c7bRhwey2y/FKQCkoUMM8/
LHwt2tavOwY9ENHybMD1o/RTGeFzUAk7ouzYx04xZT9dJcnsMVo2fwi6nx+D
4lsBqd2Zdz6S772pfAApvv5Kswc6b0wj7c/mWOWkWcKWYO5vdduO2aoJj6SY
FIMIawoEvNcfIueLbbBu2vhRkkYBekPxkM+iWYOCiaqt8jx10rAX+TvKDnXU
OvBgPPgrxzIGPzrIQkq8GHMQ5eT6bEsb7A==
=VwDo
-----END PGP PUBLIC KEY BLOCK-----
```
