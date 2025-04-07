# Get current timestamp for the backup file name
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupName = "text-annotation-platform_backup_$timestamp.zip"

# Create backup directory if it doesn't exist
$backupDir = "backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Compress the project directory, excluding node_modules, .next, and other unnecessary files
Compress-Archive -Path . -DestinationPath ".\$backupDir\$backupName" -Force

# Exclude unnecessary files and folders from the archive
$excludeList = @(
    "node_modules",
    ".next",
    "out",
    "build",
    "coverage",
    ".git",
    "backups"
)

# Create a temporary directory for filtered content
$tempDir = "temp_backup"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir

# Copy files excluding the ones in excludeList
Get-ChildItem -Path . -Exclude $excludeList | Copy-Item -Destination $tempDir -Recurse

# Create the final backup
Compress-Archive -Path "$tempDir\*" -DestinationPath ".\$backupDir\$backupName" -Force

# Clean up temporary directory
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Backup created successfully at .\$backupDir\$backupName" 