# PowerShell script to create .env file from env.example
# Run this script from the backend directory: .\setup-env.ps1

Write-Host "🔧 Setting up .env file..." -ForegroundColor Cyan

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Cancelled. Existing .env file preserved." -ForegroundColor Red
        exit
    }
}

# Check if env.example exists
if (-not (Test-Path "env.example")) {
    Write-Host "❌ env.example file not found!" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the backend directory" -ForegroundColor Yellow
    exit 1
}

# Copy env.example to .env
Copy-Item "env.example" ".env"

Write-Host "✅ Created .env file from env.example" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open .env file in a text editor" -ForegroundColor White
Write-Host "   2. Set USE_LOCAL_DB=false" -ForegroundColor White
Write-Host "   3. Add your MONGODB_URI from MongoDB Atlas" -ForegroundColor White
Write-Host "   4. Get connection string from: https://cloud.mongodb.com/" -ForegroundColor White
Write-Host ""
Write-Host "   Format: mongodb+srv://username:password@cluster.mongodb.net/placementhub?retryWrites=true&w=majority" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 After updating .env, test connection with:" -ForegroundColor Cyan
Write-Host "   node test-connection.js" -ForegroundColor White

