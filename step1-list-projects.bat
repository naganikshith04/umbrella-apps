@echo off
echo ================================================
echo  STEP 1: LIST ALL VERCEL PROJECTS
echo ================================================
echo.
echo Fetching all projects and saving to file...
echo.

REM Get all pages of projects (redirect both stdout and stderr)
vercel projects ls > projects-page1.txt 2>&1

echo.
echo First page saved to projects-page1.txt
echo.
echo Now run step2-parse-and-delete.py to delete them all
echo.
pause
