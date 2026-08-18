@echo off
echo ===================================================
echo   Merging development-branch into main & Pushing
echo ===================================================
echo.

:: 1. Ask for a commit message
set /p COMMIT_MSG="Enter commit message (Press ENTER for default 'Update dev branch'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update dev branch

:: 2. Stage and commit changes on development-branch
echo.
echo [1/5] Staging and committing changes on development-branch...
git add .
git commit -m "%COMMIT_MSG%"

:: 3. Push development-branch to origin
echo.
echo [2/5] Pushing development-branch to origin...
git push origin development-branch

:: 4. Switch to main
echo.
echo [3/5] Switching to main branch...
git checkout main

:: 5. Merge development-branch into main
echo.
echo [4/5] Merging development-branch into main...
git merge development-branch

:: 6. Push main to origin
echo.
echo [5/5] Pushing updated main to origin...
git push origin main

:: 7. Switch back to development-branch
echo.
echo Switching back to development-branch...
git checkout development-branch

echo.
echo ===================================================
echo   SUCCESS: development-branch merged to main!
echo ===================================================
pause
