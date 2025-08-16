# PowerShell curl helpers for Monochrome Arces backend
# Usage: Run sections line-by-line in PowerShell, or execute entire file after setting variables.

# ---- Config ----
$BaseUrl  = $env:BASE_URL  ; if (-not $BaseUrl)  { $BaseUrl  = 'http://localhost:8080' }
$Username = $env:API_USER  ; if (-not $Username) { $Username = 'admin' }
$Password = $env:API_PASS  ; if (-not $Password) { $Password = 'admin' }

Write-Host "BaseUrl = $BaseUrl" -ForegroundColor Cyan

# ---- Login ----
$loginBody = @{ username = $Username; password = $Password } | ConvertTo-Json -Compress
$loginResp = curl.exe -s -X POST "$BaseUrl/api/auth/login" -H "Content-Type: application/json" -d $loginBody
$loginJson = $loginResp | ConvertFrom-Json
$Global:TOKEN = $loginJson.token
$Global:REFRESH_TOKEN = $loginJson.refreshToken
if ($TOKEN) { Write-Host "Logged in. TOKEN saved." -ForegroundColor Green } else { Write-Host "Login failed: $loginResp" -ForegroundColor Red }

# ---- Current user (/me) ----
if ($TOKEN) { curl.exe -i "$BaseUrl/api/auth/me" -H "Authorization: Bearer $TOKEN" } else { Write-Host "No token present. Run login first." -ForegroundColor Yellow }

# ---- Admin demo ----
if ($TOKEN) { curl.exe -i "$BaseUrl/api/admin/demo" -H "Authorization: Bearer $TOKEN" }

# ---- SuperAdmin demo ----
if ($TOKEN) { curl.exe -i "$BaseUrl/api/superadmin/demo" -H "Authorization: Bearer $TOKEN" }

# ---- Refresh token ----
if ($REFRESH_TOKEN) {
  $refreshBody = @{ refreshToken = $REFRESH_TOKEN } | ConvertTo-Json -Compress
  $refreshResp = curl.exe -s -X POST "$BaseUrl/api/auth/refresh" -H "Content-Type: application/json" -d $refreshBody
  $refreshJson = $refreshResp | ConvertFrom-Json
  if ($refreshJson.token) {
    $Global:TOKEN = $refreshJson.token
    Write-Host "Token refreshed." -ForegroundColor Green
  } else {
    Write-Host "Refresh failed: $refreshResp" -ForegroundColor Red
  }
}

# ---- Logout ----
if ($TOKEN) { curl.exe -i -X POST "$BaseUrl/api/auth/logout" -H "Authorization: Bearer $TOKEN" }
