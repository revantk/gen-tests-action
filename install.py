import os
import requests
from actions_toolkit import core

install_url = "https://robust-ai.uc.r.appspot.com/get_install_url?is_linux=true"
robustai_api_key = os.getenv("ROBUSTAI_API_KEY")

try:
  headers = {"Authorization": f"Token {robustai_api_key}"}
  script_url = requests.get(install_url, headers=headers).json()["install_url"]
  install_script = requests.get(script_url).text
  with open("install_script.sh", "w") as f:
    f.write(install_script)
except Exception as e:
  core.set_failed(str(e)) 
