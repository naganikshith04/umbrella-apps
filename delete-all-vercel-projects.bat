@echo off
echo ================================================
echo  DELETE ALL VERCEL PROJECTS
echo  This will remove ALL apps from Vercel
echo ================================================
echo.
echo WARNING: This will delete ALL your Vercel projects!
echo Press Ctrl+C to cancel, or
pause

echo.
echo Deleting all Vercel projects...
echo ================================================

REM Delete original 18 apps
echo Deleting original 18 apps...
call vercel remove addsubtract-days-calculator --yes
call vercel remove age-calculator --yes
call vercel remove bmi-calculator --yes
call vercel remove case-converter --yes
call vercel remove color-picker --yes
call vercel remove date-difference-calculator --yes
call vercel remove dice-roller --yes
call vercel remove loan-calculator --yes
call vercel remove markdown-preview --yes
call vercel remove password-generator --yes
call vercel remove pomodoro-timer --yes
call vercel remove qr-code-generator --yes
call vercel remove random-name-generator --yes
call vercel remove tip-calculator --yes
call vercel remove unit-converter--length --yes
call vercel remove unit-converter--temperature --yes
call vercel remove word-counter --yes
call vercel remove work-hours-calculator --yes

REM Delete newly deployed apps
echo Deleting newly deployed apps...
call vercel remove army-body-fat-calculator-abcp --yes
call vercel remove auto-loan-calculator --yes
call vercel remove body-age-calculator --yes
call vercel remove body-fat-percentage-calculator --yes
call vercel remove body-surface-area-bsa-calculator --yes
call vercel remove budget-calculator --yes
call vercel remove calorie-deficit-calculator --yes
call vercel remove comma-separator-tool --yes
call vercel remove compound-interest-calculator --yes
call vercel remove credit-card-payoff-calculator --yes
call vercel remove csv-to-excel-converter --yes
call vercel remove duplicate-line-remover --yes
call vercel remove emergency-fund-calculator --yes
call vercel remove epub-to-pdf-converter --yes
call vercel remove find-and-replace --yes
call vercel remove heart-rate-zone-calculator --yes
call vercel remove heic-to-jpg-converter --yes
call vercel remove house-affordability-calculator --yes
call vercel remove html-to-pdf-converter --yes
call vercel remove html-to-plain-text --yes

echo.
echo ================================================
echo  DELETION COMPLETE!
echo ================================================
echo.
echo All Vercel projects have been deleted.
echo.
echo Next: Use Vercel Dashboard to bulk import all 83 apps
echo.
pause
