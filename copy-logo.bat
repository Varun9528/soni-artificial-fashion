@echo off
echo Copying logo file...
copy "..\public\images\logo\lettex logo.png" "public\images\logo\lettex-logo.png"
if %errorlevel% == 0 (
    echo Logo file copied successfully!
) else (
    echo Failed to copy logo file
)
pause