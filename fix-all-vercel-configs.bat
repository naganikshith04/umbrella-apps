@echo off
echo ================================================
echo  FIXING ALL VERCEL.JSON FILES
echo  Updating to modern Vercel configuration
echo ================================================
echo.
pause

cd /d "%~dp0"

echo.
echo Fixing vercel.json files...
echo ================================================

for /D %%d in (*) do (
    if exist "%%d\vercel.json" (
        echo Fixing %%d\vercel.json...
        (
            echo {
            echo   "version": 2
            echo }
        ) > "%%d\vercel.json"
    )
)

echo.
echo ================================================
echo  FIX COMPLETE!
echo ================================================
echo.
echo All vercel.json files have been updated to modern format.
echo CSS and JS should now load correctly!
echo.
pause
