#!/usr/bin/env node
const https = require('https');
const core = require("@actions/core");
const { context, GitHub } = require("@actions/github");
const fs = require('fs'); 

const URL = "https://robust-ai.uc.r.appspot.com/get_install_url?is_linux=true";
const ROBUSTAI_API_KEY = process.env.ROBUSTAI_API_KEY;

async function run() {
  const headers = {"Authorization": `Token ${ROBUSTAI_API_KEY}`}
  const installURLResp = await fetch(URL, {headers: headers});
  const installURL = await installURLResp.json();

  const installScriptResp = await fetch(installURL.install_url);
  const installScriptText = await installScriptResp.text();
  
  fs.writeFileSync("install_script.sh", installScriptText);
}

run().catch(err => {
    console.error(err);
    core.setFailed(err.toString());
});
