@echo off
echo npm publish? (y/n)
set /p judge=
if "%judge%" == "y" echo on
npm publish
pause