# PowerShell script to copy the logo file
Write-Host "Copying logo file..."

# Define source and destination paths
$sourcePath = "..\public\images\logo\lettex logo.png"
$destPath = "public\images\logo\lettex-logo.png"

Write-Host "Source path: $sourcePath"
Write-Host "Destination path: $destPath"

# Check if source file exists
if (Test-Path $sourcePath) {
    Write-Host "Source file exists"
    try {
        Copy-Item $sourcePath $destPath -Force
        Write-Host "Logo file copied successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Error copying file: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Source file does not exist"
}