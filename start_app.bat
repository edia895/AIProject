@echo off
echo Starting Fullstack App...

:: バックエンドを新しいウィンドウで起動
start cmd /k "cd backend && npm run start:dev"

:: フロントエンドを新しいウィンドウで起動
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
pause