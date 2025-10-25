<#
PowerShell helper to export the frontend part of this monorepo into a standalone folder
Usage: run from the repo root (where package.json and src/ live):
  pwsh ./scripts/export_frontend.ps1

This will create a sibling folder named `smart-campus-frontend` (next to this repo folder), copy
only the frontend files (root package.json, src/, public/, index.html, vite config, tsconfigs),
initialize a git repo there and make an initial commit. It does NOT set any remote.
#>
Param(
  [string]$DestName = 'smart-campus-frontend'
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

$keep = @(
  'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lockb',
  'index.html', 'vite.config.ts', 'vite.config.js', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json',
  'postcss.config.js', 'tailwind.config.ts', '.eslintrc.js', '.prettierrc', '.gitignore'
)

foreach ($name in $keep) {
  $src = Join-Path $root $name
  if (Test-Path $src) { Copy-Item $src -Destination $dest -Recurse -Force }
}

# copy folders
$folders = @('src','public','assets')
foreach ($f in $folders) {
  $src = Join-Path $root $f
  if (Test-Path $src) { Copy-Item $src -Destination $dest -Recurse -Force }
}

# create a minimal README
@"
# Smart Campus - Frontend

This folder was exported from the monorepo. It contains the Vite + React frontend.

To run:

  cd $DestName
  npm install
  npm run dev

Build for production:

  npm run build

Note: set environment variables prefixed with VITE_ (for example VITE_API_BASE) before building/deploying.
"@" | Out-File -FilePath (Join-Path $dest 'README.md') -Encoding UTF8

Push instructions
Write-Host "Initializing git repository in $dest"
Push-Location $dest
git init
git add .
git commit -m "Import frontend from monorepo"
Write-Host "Frontend exported to $dest. To push to GitHub: cd $dest; git remote add origin <your-repo-url>; git push -u origin main" -ForegroundColor Green
Pop-Location
