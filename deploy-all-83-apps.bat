@echo off
echo ================================================
echo  VERCEL BULK DEPLOYMENT SCRIPT
echo  Deploying ALL 83 Apps to Vercel
echo ================================================
echo.
echo This will deploy all 83 apps to Vercel in production mode.
echo Each app will get its own vercel.app subdomain.
echo.
echo IMPORTANT: This may take 30-60 minutes to complete!
echo.
pause

cd /d "%~dp0"

echo.
echo Starting deployments...
echo ================================================

set count=0

for /D %%d in (*) do (
    if exist "%%d\vercel.json" (
        set /a count+=1
        echo.
        echo [!count!/83] Deploying %%d...
        cd "%%d"
        call vercel --prod --yes --name %%d 2>&1 | findstr /C:"Production" /C:"Error" /C:"Deployed"
        cd ..
    )
)

echo.
echo ================================================
echo  DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo All 83 apps have been deployed to Vercel!
echo.
echo To see your apps:
echo 1. Go to https://vercel.com/dashboard
echo 2. All your apps are listed there
echo 3. Click any app to see its live URL
echo.
echo Expected URLs format:
echo - https://[app-name].vercel.app
echo.
echo ================================================
echo Next Steps:
echo ================================================
echo 1. Visit each URL to verify deployment
echo 2. Test AdSense code is present
echo 3. Submit sitemap to Google Search Console
echo 4. Wait for AdSense approval (1-2 weeks)
echo 5. Start earning money!
echo.
echo ================================================
pause
