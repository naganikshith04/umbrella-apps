@echo off
echo ================================================
echo  DEPLOYING ONLY THE NEW 65 APPS
echo  (Skipping the original 18 already deployed)
echo ================================================
echo.
pause

cd /d "%~dp0"

echo.
echo Starting deployments of NEW apps only...
echo ================================================

REM Skip these 18 - already deployed
REM addsubtract-days-calculator, age-calculator, bmi-calculator, case-converter,
REM color-picker, date-difference-calculator, dice-roller, loan-calculator,
REM markdown-preview, password-generator, pomodoro-timer, qr-code-generator,
REM random-name-generator, tip-calculator, unit-converter--length,
REM unit-converter--temperature, word-counter, work-hours-calculator

echo [1/65] Deploying army-body-fat-calculator-abcp...
cd army-body-fat-calculator-abcp
call vercel --prod --yes --name army-body-fat-calculator-abcp
cd ..

echo [2/65] Deploying auto-loan-calculator...
cd auto-loan-calculator
call vercel --prod --yes --name auto-loan-calculator
cd ..

echo [3/65] Deploying body-age-calculator...
cd body-age-calculator
call vercel --prod --yes --name body-age-calculator
cd ..

echo [4/65] Deploying body-fat-percentage-calculator...
cd body-fat-percentage-calculator
call vercel --prod --yes --name body-fat-percentage-calculator
cd ..

echo [5/65] Deploying body-surface-area-bsa-calculator...
cd body-surface-area-bsa-calculator
call vercel --prod --yes --name body-surface-area-bsa-calculator
cd ..

echo [6/65] Deploying budget-calculator...
cd budget-calculator
call vercel --prod --yes --name budget-calculator
cd ..

echo [7/65] Deploying calorie-deficit-calculator...
cd calorie-deficit-calculator
call vercel --prod --yes --name calorie-deficit-calculator
cd ..

echo [8/65] Deploying comma-separator-tool...
cd comma-separator-tool
call vercel --prod --yes --name comma-separator-tool
cd ..

echo [9/65] Deploying compound-interest-calculator...
cd compound-interest-calculator
call vercel --prod --yes --name compound-interest-calculator
cd ..

echo [10/65] Deploying credit-card-payoff-calculator...
cd credit-card-payoff-calculator
call vercel --prod --yes --name credit-card-payoff-calculator
cd ..

echo [11/65] Deploying csv-to-excel-converter...
cd csv-to-excel-converter
call vercel --prod --yes --name csv-to-excel-converter
cd ..

echo [12/65] Deploying duplicate-line-remover...
cd duplicate-line-remover
call vercel --prod --yes --name duplicate-line-remover
cd ..

echo [13/65] Deploying emergency-fund-calculator...
cd emergency-fund-calculator
call vercel --prod --yes --name emergency-fund-calculator
cd ..

echo [14/65] Deploying epub-to-pdf-converter...
cd epub-to-pdf-converter
call vercel --prod --yes --name epub-to-pdf-converter
cd ..

echo [15/65] Deploying find-and-replace...
cd find-and-replace
call vercel --prod --yes --name find-and-replace
cd ..

echo [16/65] Deploying heart-rate-zone-calculator...
cd heart-rate-zone-calculator
call vercel --prod --yes --name heart-rate-zone-calculator
cd ..

echo [17/65] Deploying heic-to-jpg-converter...
cd heic-to-jpg-converter
call vercel --prod --yes --name heic-to-jpg-converter
cd ..

echo [18/65] Deploying house-affordability-calculator...
cd house-affordability-calculator
call vercel --prod --yes --name house-affordability-calculator
cd ..

echo [19/65] Deploying html-to-pdf-converter...
cd html-to-pdf-converter
call vercel --prod --yes --name html-to-pdf-converter
cd ..

echo [20/65] Deploying html-to-plain-text...
cd html-to-plain-text
call vercel --prod --yes --name html-to-plain-text
cd ..

echo [21/65] Deploying ideal-weight-calculator...
cd ideal-weight-calculator
call vercel --prod --yes --name ideal-weight-calculator
cd ..

echo [22/65] Deploying image-format-converter...
cd image-format-converter
call vercel --prod --yes --name image-format-converter
cd ..

echo [23/65] Deploying intermittent-fasting-calculator...
cd intermittent-fasting-calculator
call vercel --prod --yes --name intermittent-fasting-calculator
cd ..

echo [24/65] Deploying invisible-character-detector...
cd invisible-character-detector
call vercel --prod --yes --name invisible-character-detector
cd ..

echo [25/65] Deploying lean-body-mass-calculator...
cd lean-body-mass-calculator
call vercel --prod --yes --name lean-body-mass-calculator
cd ..

echo [26/65] Deploying line-sorter...
cd line-sorter
call vercel --prod --yes --name line-sorter
cd ..

echo [27/65] Deploying lorem-ipsum-generator...
cd lorem-ipsum-generator
call vercel --prod --yes --name lorem-ipsum-generator
cd ..

echo [28/65] Deploying markdown-to-html-converter...
cd markdown-to-html-converter
call vercel --prod --yes --name markdown-to-html-converter
cd ..

echo [29/65] Deploying meeting-time-scheduler...
cd meeting-time-scheduler
call vercel --prod --yes --name meeting-time-scheduler
cd ..

echo [30/65] Deploying mov-to-mp4-converter...
cd mov-to-mp4-converter
call vercel --prod --yes --name mov-to-mp4-converter
cd ..

echo [31/65] Deploying mp4-to-gif-converter...
cd mp4-to-gif-converter
call vercel --prod --yes --name mp4-to-gif-converter
cd ..

echo [32/65] Deploying muscle-gain-calculator...
cd muscle-gain-calculator
call vercel --prod --yes --name muscle-gain-calculator
cd ..

echo [33/65] Deploying net-worth-calculator...
cd net-worth-calculator
call vercel --prod --yes --name net-worth-calculator
cd ..

echo [34/65] Deploying one-rep-max-1rm-calculator...
cd one-rep-max-1rm-calculator
call vercel --prod --yes --name one-rep-max-1rm-calculator
cd ..

echo [35/65] Deploying pdf-to-excel-converter...
cd pdf-to-excel-converter
call vercel --prod --yes --name pdf-to-excel-converter
cd ..

echo [36/65] Deploying pdf-to-jpg-converter...
cd pdf-to-jpg-converter
call vercel --prod --yes --name pdf-to-jpg-converter
cd ..

echo [37/65] Deploying pdf-to-word-converter...
cd pdf-to-word-converter
call vercel --prod --yes --name pdf-to-word-converter
cd ..

echo [38/65] Deploying png-to-ico-converter...
cd png-to-ico-converter
call vercel --prod --yes --name png-to-ico-converter
cd ..

echo [39/65] Deploying powerpoint-to-pdf-converter...
cd powerpoint-to-pdf-converter
call vercel --prod --yes --name powerpoint-to-pdf-converter
cd ..

echo [40/65] Deploying pregnancy-weight-gain-calculator...
cd pregnancy-weight-gain-calculator
call vercel --prod --yes --name pregnancy-weight-gain-calculator
cd ..

echo [41/65] Deploying project-deadline-calculator...
cd project-deadline-calculator
call vercel --prod --yes --name project-deadline-calculator
cd ..

echo [42/65] Deploying random-text-generator...
cd random-text-generator
call vercel --prod --yes --name random-text-generator
cd ..

echo [43/65] Deploying refinance-calculator...
cd refinance-calculator
call vercel --prod --yes --name refinance-calculator
cd ..

echo [44/65] Deploying rent-vs-buy-calculator...
cd rent-vs-buy-calculator
call vercel --prod --yes --name rent-vs-buy-calculator
cd ..

echo [45/65] Deploying running-pace-calculator...
cd running-pace-calculator
call vercel --prod --yes --name running-pace-calculator
cd ..

echo [46/65] Deploying sentence-counter...
cd sentence-counter
call vercel --prod --yes --name sentence-counter
cd ..

echo [47/65] Deploying slug-generator...
cd slug-generator
call vercel --prod --yes --name slug-generator
cd ..

echo [48/65] Deploying student-loan-calculator...
cd student-loan-calculator
call vercel --prod --yes --name student-loan-calculator
cd ..

echo [49/65] Deploying svg-to-png-converter...
cd svg-to-png-converter
call vercel --prod --yes --name svg-to-png-converter
cd ..

echo [50/65] Deploying tax-refund-calculator...
cd tax-refund-calculator
call vercel --prod --yes --name tax-refund-calculator
cd ..

echo [51/65] Deploying text-difference-checker...
cd text-difference-checker
call vercel --prod --yes --name text-difference-checker
cd ..

echo [52/65] Deploying text-encryption-tool...
cd text-encryption-tool
call vercel --prod --yes --name text-encryption-tool
cd ..

echo [53/65] Deploying text-repeater...
cd text-repeater
call vercel --prod --yes --name text-repeater
cd ..

echo [54/65] Deploying text-reverser...
cd text-reverser
call vercel --prod --yes --name text-reverser
cd ..

echo [55/65] Deploying text-splitter...
cd text-splitter
call vercel --prod --yes --name text-splitter
cd ..

echo [56/65] Deploying text-to-speech...
cd text-to-speech
call vercel --prod --yes --name text-to-speech
cd ..

echo [57/65] Deploying time-card-calculator...
cd time-card-calculator
call vercel --prod --yes --name time-card-calculator
cd ..

echo [58/65] Deploying time-zone-converter...
cd time-zone-converter
call vercel --prod --yes --name time-zone-converter
cd ..

echo [59/65] Deploying txt-to-pdf-converter...
cd txt-to-pdf-converter
call vercel --prod --yes --name txt-to-pdf-converter
cd ..

echo [60/65] Deploying video-to-mp4-converter...
cd video-to-mp4-converter
call vercel --prod --yes --name video-to-mp4-converter
cd ..

echo [61/65] Deploying vo2-max-calculator...
cd vo2-max-calculator
call vercel --prod --yes --name vo2-max-calculator
cd ..

echo [62/65] Deploying waist-to-hip-ratio-calculator...
cd waist-to-hip-ratio-calculator
call vercel --prod --yes --name waist-to-hip-ratio-calculator
cd ..

echo [63/65] Deploying water-intake-calculator...
cd water-intake-calculator
call vercel --prod --yes --name water-intake-calculator
cd ..

echo [64/65] Deploying webp-to-jpg-converter...
cd webp-to-jpg-converter
call vercel --prod --yes --name webp-to-jpg-converter
cd ..

echo [65/65] Deploying whitespace-remover...
cd whitespace-remover
call vercel --prod --yes --name whitespace-remover
cd ..

echo.
echo ================================================
echo  DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo All 65 NEW apps have been deployed to Vercel!
echo Combined with the original 18, you now have 83 live apps!
echo.
echo ================================================
pause
