<#
PowerShell helper to export the backend (server/) part of this monorepo into a standalone folder
Usage: run from the repo root:
  pwsh ./scripts/export_backend.ps1

This will create a sibling folder named `smart-campus-backend`, copy the server/ folder contents,
initialize a git repo there and make an initial commit. It does NOT set any remote.
#>
Param(
  [string]$DestName = 'smart-campus-backend'
)

$root = (Get-Location).Path
$parent = Split-Path $root -Parent
$dest = Join-Path $parent $DestName

if (Test-Path $dest) {
  Write-Host "Destination $dest already exists. Aborting. Remove it first if you want to re-export." -ForegroundColor Yellow
  exit 1
}

Write-Host "Creating destination: $dest"
New-Item -ItemType Directory -Path $dest | Out-Null

$src = Join-Path $root 'server'
if (-not (Test-Path $src)) { Write-Host "No server/ folder found in repo root" -ForegroundColor Red; exit 1 }

Copy-Item $src\* -Destination $dest -Recurse -Force

# copy server root package.json if exists
$serverPkg = Join-Path $root 'server\package.json'
if (Test-Path $serverPkg) { Copy-Item $serverPkg -Destination $dest -Force }

@"
# Smart Campus - Backend

This folder contains the Express backend exported from the monorepo.

To run:

  cd $DestName
  npm install
  npm run dev  # development (nodemon)
  npm start    # production (node index.js)

Environment variables required (set on Render or locally):
  MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, ALLOWED_EMAIL_DOMAIN,
  GMAIL_USER, GMAIL_PASS
"@" | Out-File -FilePath (Join-Path $dest 'README.md') -Encoding UTF8

Write-Host "Initializing git repository in $dest"
Push-Location $dest
git init
git add .
git commit -m "Import backend from monorepo"
Write-Host "Backend exported to $dest. To push to GitHub: cd $dest; git remote add origin <your-repo-url>; git push -u origin main" -ForegroundColor Green
Pop-Location
