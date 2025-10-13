@echo off
echo Starting logo copy operation...

echo Source path: ..\public\images\logo\lettex-logo.png
echo Destination path: public\images\logo\lettex-logo.png

REM Delete destination file if it exists
if exist "public\images\logo\lettex-logo.png" (
    del "public\images\logo\lettex-logo.png"
    echo Deleted existing destination file
)

REM Copy file using xcopy
xcopy "..\public\images\logo\lettex-logo.png" "public\images\logo\" /Y

if %errorlevel% == 0 (
    echo ✅ Logo file copied successfully!
) else (
    echo ❌ Failed to copy logo file
)

REM Check file size
if exist "public\images\logo\lettex-logo.png" (
    for %%A in ("public\images\logo\lettex-logo.png") do (
        echo Destination file size: %%~zA bytes
    )
) else (
    echo Destination file does not exist
)

pause