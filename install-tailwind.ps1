# Manual Tailwind CSS v4 installation script
Write-Host "Installing Tailwind CSS v4 packages..." -ForegroundColor Cyan

# Remove existing entries
npm uninstall @tailwindcss/postcss tailwindcss 2>&1 | Out-Null

# Clear npm cache for these packages
npm cache clean --force 2>&1 | Out-Null

# Install with explicit flags
npm install @tailwindcss/postcss@4.1.18 tailwindcss@4.1.18 --save-dev --legacy-peer-deps --no-save

# Verify installation
if (Test-Path "node_modules/@tailwindcss/postcss") {
    Write-Host "✓ @tailwindcss/postcss installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ @tailwindcss/postcss installation failed" -ForegroundColor Red
    Write-Host "Try running: npm install @tailwindcss/postcss@4.1.18 tailwindcss@4.1.18 --save-dev --legacy-peer-deps" -ForegroundColor Yellow
}

if (Test-Path "node_modules/tailwindcss") {
    Write-Host "✓ tailwindcss installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ tailwindcss installation failed" -ForegroundColor Red
}

