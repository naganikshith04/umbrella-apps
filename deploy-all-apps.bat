@echo off
echo ================================================
echo  VERCEL BULK DEPLOYMENT SCRIPT
echo  Deploying 18 Umbrella Apps
echo ================================================
echo.
echo This will deploy all 18 apps to Vercel in production mode.
echo Each app will get its own vercel.app subdomain.
echo.
pause

cd /d "%~dp0"

echo.
echo Starting deployments...
echo ================================================

REM High-value apps first
echo.
echo [1/18] Deploying Loan Calculator (HIGH VALUE)...
cd loan-calculator
call vercel --prod --yes --name loan-calculator-umbrella
cd ..

echo.
echo [2/18] Deploying BMI Calculator...
cd bmi-calculator
call vercel --prod --yes --name bmi-calculator-umbrella
cd ..

echo.
echo [3/18] Deploying Tip Calculator...
cd tip-calculator
call vercel --prod --yes --name tip-calculator-umbrella
cd ..

echo.
echo [4/18] Deploying Password Generator...
cd password-generator
call vercel --prod --yes --name password-generator-umbrella
cd ..

echo.
echo [5/18] Deploying Word Counter...
cd word-counter
call vercel --prod --yes --name word-counter-umbrella
cd ..

echo.
echo [6/18] Deploying Case Converter...
cd case-converter
call vercel --prod --yes --name case-converter-umbrella
cd ..

echo.
echo [7/18] Deploying Color Picker...
cd color-picker
call vercel --prod --yes --name color-picker-umbrella
cd ..

echo.
echo [8/18] Deploying QR Code Generator...
cd qr-code-generator
call vercel --prod --yes --name qr-code-generator-umbrella
cd ..

echo.
echo [9/18] Deploying Dice Roller...
cd dice-roller
call vercel --prod --yes --name dice-roller-umbrella
cd ..

echo.
echo [10/18] Deploying Random Name Generator...
cd random-name-generator
call vercel --prod --yes --name random-name-generator-umbrella
cd ..

echo.
echo [11/18] Deploying Age Calculator...
cd age-calculator
call vercel --prod --yes --name age-calculator-umbrella
cd ..

echo.
echo [12/18] Deploying Date Difference Calculator...
cd date-difference-calculator
call vercel --prod --yes --name date-diff-calculator-umbrella
cd ..

echo.
echo [13/18] Deploying Add/Subtract Days Calculator...
cd addsubtract-days-calculator
call vercel --prod --yes --name days-calculator-umbrella
cd ..

echo.
echo [14/18] Deploying Unit Converter - Length...
cd unit-converter--length
call vercel --prod --yes --name length-converter-umbrella
cd ..

echo.
echo [15/18] Deploying Unit Converter - Temperature...
cd unit-converter--temperature
call vercel --prod --yes --name temp-converter-umbrella
cd ..

echo.
echo [16/18] Deploying Pomodoro Timer...
cd pomodoro-timer
call vercel --prod --yes --name pomodoro-timer-umbrella
cd ..

echo.
echo [17/18] Deploying Markdown Preview...
cd markdown-preview
call vercel --prod --yes --name markdown-preview-umbrella
cd ..

echo.
echo [18/18] Deploying Work Hours Calculator...
cd work-hours-calculator
call vercel --prod --yes --name work-hours-calculator-umbrella
cd ..

echo.
echo ================================================
echo  DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo All 18 apps have been deployed to Vercel!
echo.
echo To see your apps:
echo 1. Go to https://vercel.com/dashboard
echo 2. All your apps are listed there
echo 3. Click any app to see its live URL
echo.
echo Expected URLs format:
echo - https://loan-calculator-umbrella.vercel.app
echo - https://bmi-calculator-umbrella.vercel.app
echo - etc.
echo.
echo ================================================
echo Next Steps:
echo ================================================
echo 1. Visit each URL to verify deployment
echo 2. Test AdSense code (view source, check for ca-pub-9048718254553458)
echo 3. Submit to Google Search Console
echo 4. Wait for AdSense approval (1-2 weeks)
echo 5. Start earning money!
echo.
echo ================================================
pause
