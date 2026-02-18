@echo off
echo ================================================
echo  VERCEL REDEPLOY SCRIPT
echo  Redeploying all 18 apps with fixed configs
echo ================================================
echo.
echo This will redeploy all apps to production.
echo The CSS/JS should load properly now!
echo.
pause

cd /d "%~dp0"

echo.
echo Redeploying all apps...
echo ================================================

echo.
echo [1/18] Redeploying Loan Calculator...
cd loan-calculator
call vercel --prod
cd ..

echo.
echo [2/18] Redeploying BMI Calculator...
cd bmi-calculator
call vercel --prod
cd ..

echo.
echo [3/18] Redeploying Tip Calculator...
cd tip-calculator
call vercel --prod
cd ..

echo.
echo [4/18] Redeploying Password Generator...
cd password-generator
call vercel --prod
cd ..

echo.
echo [5/18] Redeploying Word Counter...
cd word-counter
call vercel --prod
cd ..

echo.
echo [6/18] Redeploying Case Converter...
cd case-converter
call vercel --prod
cd ..

echo.
echo [7/18] Redeploying Color Picker...
cd color-picker
call vercel --prod
cd ..

echo.
echo [8/18] Redeploying QR Code Generator...
cd qr-code-generator
call vercel --prod
cd ..

echo.
echo [9/18] Redeploying Dice Roller...
cd dice-roller
call vercel --prod
cd ..

echo.
echo [10/18] Redeploying Random Name Generator...
cd random-name-generator
call vercel --prod
cd ..

echo.
echo [11/18] Redeploying Age Calculator...
cd age-calculator
call vercel --prod
cd ..

echo.
echo [12/18] Redeploying Date Difference Calculator...
cd date-difference-calculator
call vercel --prod
cd ..

echo.
echo [13/18] Redeploying Add/Subtract Days...
cd addsubtract-days-calculator
call vercel --prod
cd ..

echo.
echo [14/18] Redeploying Length Converter...
cd unit-converter--length
call vercel --prod
cd ..

echo.
echo [15/18] Redeploying Temperature Converter...
cd unit-converter--temperature
call vercel --prod
cd ..

echo.
echo [16/18] Redeploying Pomodoro Timer...
cd pomodoro-timer
call vercel --prod
cd ..

echo.
echo [17/18] Redeploying Markdown Preview...
cd markdown-preview
call vercel --prod
cd ..

echo.
echo [18/18] Redeploying Work Hours Calculator...
cd work-hours-calculator
call vercel --prod
cd ..

echo.
echo ================================================
echo  REDEPLOY COMPLETE!
echo ================================================
echo.
echo All 18 apps redeployed with fixed configs!
echo CSS and JS should now load properly.
echo.
echo Test an app:
echo https://loan-calculator-umbrella.vercel.app
echo.
echo ================================================
pause
