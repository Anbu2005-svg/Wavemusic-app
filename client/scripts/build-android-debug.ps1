$ErrorActionPreference = "Stop"

$clientRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $clientRoot "android"
$androidStudioJbr = "C:\Program Files\Android\Android Studio\jbr"
$androidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$gradleUserHome = Join-Path $androidRoot ".gradle-home"

if (-not $env:JAVA_HOME -and (Test-Path (Join-Path $androidStudioJbr "bin\java.exe"))) {
  $env:JAVA_HOME = $androidStudioJbr
}

if (-not $env:JAVA_HOME) {
  throw "JAVA_HOME is not set. Install Android Studio or set JAVA_HOME to a JDK."
}

if (-not $env:ANDROID_HOME -and (Test-Path $androidSdk)) {
  $env:ANDROID_HOME = $androidSdk
}

if (-not $env:ANDROID_HOME) {
  throw "ANDROID_HOME is not set. Install the Android SDK or set ANDROID_HOME."
}

$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
$env:GRADLE_USER_HOME = $gradleUserHome

New-Item -ItemType Directory -Force $gradleUserHome | Out-Null

Push-Location $androidRoot
try {
  .\gradlew.bat assembleDebug
  if ($LASTEXITCODE -ne 0) {
    throw "Gradle assembleDebug failed with exit code $LASTEXITCODE."
  }
}
finally {
  Pop-Location
}
