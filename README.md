# afj-hello-world-verifier
A "hello world" style app that implements a very rudimentary verifier using typescript, nodejs, aries-framework-javascript (also typescript).

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/watkinspd/afj-hello-world-verifier)

## Concept
Demonstrate a minimal, working, verifier app that makes use of aries-framework-javascript.

<a href = "https://github.com/hyperledger/aries-framework-javascript" title="https://github.com/hyperledger/aries-framework-javascript">https://github.com/hyperledger/aries-framework-javascript</a>


Remove as much complexity and noise associated with setup, configuration of development and runtime environments, code frameworks, tooling, toolchains and so on.

The goal being to give beginners confidence that the core features for the hyperledger indy, aries, bifold stack are functional as they tackle the challenges of building any real-world apps with production grade design, frameworks and associated tooling.

## How to use

### Requirements:
<ul>
  <li> Your local machine - Windows, Mac, Linux (tested on Windows 11)</li>
   <ul>
    <li> docker (tested using Docker Desktop) to run the demo app</li>
    <li> ngrok (or equivalent) to expose the service endpoint and port of the demo app as it runs in its docker container</li>
   </ul>
  <li> Install a wallet on your android or iOS device</li>
   <ul>
    <li><a href = "https://apps.apple.com/us/app/bc-wallet/id1587380443" title="https://apps.apple.com/us/app/bc-wallet/id1587380443">https://apps.apple.com/us/app/bc-wallet/id1587380443</a></li>
    <li><a href = "https://play.google.com/store/apps/details?id=ca.bc.gov.BCWallet&gl=US" title="https://play.google.com/store/apps/details?id=ca.bc.gov.BCWallet&gl=US">https://play.google.com/store/apps/details?id=ca.bc.gov.BCWallet&gl=US</a></li>
   </ul>
  <li> Get an unverified person credential from the credential issuer</li>
   <ul>
   <li>
   <a href = "https://openvp-candy-dev.vonx.io/" title="https://openvp-candy-dev.vonx.io/">https://openvp-candy-dev.vonx.io/</a>
   </li>
    <li>
   <a href = "https://candyscan.idlab.org/tx/CANDY_DEV/domain/25691" title="https://candyscan.idlab.org/tx/CANDY_DEV/domain/25691">https://candyscan.idlab.org/tx/CANDY_DEV/domain/25691</a>
   </li>
   </ul>    
</ul>

### Steps
<ol>
<li> Get familiar with ngrok</li>
From the command line of your local machine use a command like:
<pre>
<code>ngrok http 8020</code>
</pre>
<p>Make note of the public URL that results. Unless you pay ngrok for a service plan that allows you to reserve a subdomain you will have a new ngrok URL each time you start/stop ngrok. This URL needs to be edited into the demo app before you make use of it.</p>
<li> Clone the repo</li>

<pre><code>git clone https://github.com/watkinspd/afj-hello-world-verifier.git
cd afj-hello-world-verifier
</code></pre>

<li> Review and edit ./src/server.ts file, adjust service endpoint URL and port as required.</li>
<pre>
<code>const serviceEndpoint = 'faber-pdub.ngrok.io'   //needs to match your ngrok session
const serviceEndpointPort = 8020               // needs to match your ngrok session</code>
</pre>
<li> Build the docker image</li>
<pre>
<code>docker build . -t afj-hello-world-verifier</code>
</pre>
<li> Run the docker image</li>
<pre>
<code>docker run -p 8020:8020 -p 3000:3000 afj-hello-world-verifier</code>
</pre>
<p>You will be able to view the console log and see some of the activities of the demo app.</p>
<li> Use your browser</li>
    <ul><li> Create a connection invitation</li>
   <p><br /><a href = "http://localhost:3000/" title="http://localhost:3000/">http://localhost:3000/</a>
   <br /></p>
    </li></ul>  
<li> Scan the qr code with your wallet</li>
<ul>
<li> Use your wallet to respond to the proof request</li>
</ul>
<li> Watch the console log for the docker container running the demo app. You will see the connection, proof request, proof response, proof verification activity.</li>
</ul>
<li> Feel good! Start your imagination.</li>
</ol>

## Limitations of this demo app

The aim of this exercise was to show a bare bones stripped down demo app for a rudimentary verifier. This is only suitable as a learning tool for developers. This limited demo app is missing obvious features for UI, security, multiuser capability, persistence and so on. Other projects can provide examples of more robust production grade apps.

## Visual Code devcontainer support

Open the folder using visual code and it detects the devcontainer.json configration and asks if you want to open the demo app in devcontainers.
This has been tested on Windows 11 with docker desktop.
TDB - fuller description
