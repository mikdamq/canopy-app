#!/usr/bin/env bash
# Uploads dist/lamina (made by package.sh) to the cPanel app folder over FTPS, then
# restarts the app. Run by the "cPanel package" workflow after each merge to main.
#
# Needs three GitHub secrets (repo → Settings → Secrets and variables → Actions):
#   FTP_SERVER    the server name cPanel shows for FTP (e.g. server123.web-hosting.com)
#   FTP_USERNAME  an FTP account whose folder is the app root (e.g. deploy@laminafarm.app)
#   FTP_PASSWORD  its password
# Without them it does nothing, and the zip is still there to upload by hand.
set -euo pipefail
cd "$(dirname "$0")/../.."
SRC=dist/lamina

if [ -z "${FTP_SERVER:-}" ] || [ -z "${FTP_USERNAME:-}" ] || [ -z "${FTP_PASSWORD:-}" ]; then
  echo "::notice::FTP secrets aren't set, so nothing was published. Upload the lamina-cpanel package by hand (docs/hosting-cpanel.md)."
  exit 0
fi
[ -d "$SRC" ] || { echo "::error::$SRC is missing: run deploy/cpanel/package.sh first."; exit 1; }
command -v lftp >/dev/null || { sudo apt-get update -qq && sudo apt-get install -y -qq lftp; }

# Passenger restarts the app when tmp/restart.txt changes.
date -u +%Y-%m-%dT%H:%M:%SZ > dist/restart.txt

export LFTP_PASSWORD="$FTP_PASSWORD" # read by --env-password, so it never shows in the process list
ftp() {
  lftp --env-password -u "$FTP_USERNAME" "$FTP_SERVER" -e "
    set ftp:ssl-force true; set ftp:ssl-protect-data true;
    set ssl:verify-certificate ${FTP_VERIFY_CERT:-true};
    set net:max-retries 3; set net:timeout 30; set net:reconnect-interval-base 5;
    set cmd:fail-exit true;
    $1
    quit"
}

# If the packages the server needs changed, cPanel's "Run NPM Install" has to be pressed once.
rm -f dist/remote-package.json
ftp "get -e package.json -o dist/remote-package.json" >/dev/null 2>&1 || true
if ! cmp -s dist/remote-package.json "$SRC/package.json"; then
  NPM_NOTE=1
fi

# Upload everything (hidden .next folder and .npmrc included). Files that only exist on
# the server, like node_modules and logs, are left alone.
ftp "mirror --reverse --parallel=4 --verbose=1 $SRC/ /" || {
  # The usual first-time problem: FTP_SERVER isn't the name on the server's certificate
  # (on shared hosting, ftp.yourdomain often isn't). Show the names it is valid for.
  hostport=${FTP_SERVER#ftp://}; hostport=${hostport%%/*}; host=${hostport%%:*}
  port=21; [ "$hostport" != "$host" ] && port=${hostport##*:}
  names=$(timeout 20 openssl s_client -starttls ftp -connect "$host:$port" -servername "$host" </dev/null 2>/dev/null \
    | openssl x509 -noout -subject -ext subjectAltName 2>/dev/null \
    | grep -oE '(CN ?= ?|DNS:)[^,/ ]+' | sed -E 's/^(CN ?= ?|DNS:)//' | sort -u | tr '\n' ' ' || true)
  if [ -n "$names" ]; then
    echo "::error::Upload failed. If the error above mentions the certificate, set the FTP_SERVER secret to one of the names the server's certificate is for: ${names}"
  fi
  exit 1
}
# Restart last, once every file is in place.
ftp "mkdir -p -f tmp; put -O tmp dist/restart.txt"

echo "Published $(grep commit "$SRC/BUILD.txt" | cut -d' ' -f2) to $FTP_SERVER and restarted the app."
if [ "${NPM_NOTE:-}" = 1 ]; then
  echo "::warning::The site's packages changed. In cPanel → Setup Node.js App, click Run NPM Install, then Restart."
fi
