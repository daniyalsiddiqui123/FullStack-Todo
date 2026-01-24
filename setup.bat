@echo off
echo Setting up the Next.js Todo Application...

REM Install dependencies
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed successfully!

REM Generate Prisma client
echo Generating Prisma client...
npx prisma generate

if %errorlevel% neq 0 (
    echo Error: Failed to generate Prisma client
    pause
    exit /b 1
)

echo Prisma client generated successfully!

REM Apply database migrations
echo Applying database migrations...
npx prisma migrate dev

if %errorlevel% neq 0 (
    echo Error: Failed to apply database migrations
    pause
    exit /b 1
)

echo Database migrations applied successfully!

echo.
echo Setup completed successfully!
echo.
echo To run the application, use: npm run dev
echo The application will be available at: http://localhost:3000
pause