# PowerShell script for downloading SadTalker models on Windows

Write-Host "Creating directories..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "checkpoints" | Out-Null
New-Item -ItemType Directory -Force -Path "gfpgan\weights" | Out-Null

Write-Host "Downloading SadTalker models..." -ForegroundColor Green
Write-Host ""

# Function to download file with progress
function Download-File {
    param(
        [string]$Url,
        [string]$OutFile
    )
    
    try {
        Write-Host "Downloading $OutFile..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $Url -OutFile $OutFile -UseBasicParsing
        Write-Host "✓ Downloaded: $OutFile" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download: $OutFile" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# SadTalker models
$models = @(
    @{Url="https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00109-model.pth.tar"; File="checkpoints\mapping_00109-model.pth.tar"},
    @{Url="https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00229-model.pth.tar"; File="checkpoints\mapping_00229-model.pth.tar"},
    @{Url="https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_256.safetensors"; File="checkpoints\SadTalker_V0.0.2_256.safetensors"},
    @{Url="https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_512.safetensors"; File="checkpoints\SadTalker_V0.0.2_512.safetensors"}
)

# GFPGAN enhancer models
$enhancerModels = @(
    @{Url="https://github.com/xinntao/facexlib/releases/download/v0.1.0/alignment_WFLW_4HG.pth"; File="gfpgan\weights\alignment_WFLW_4HG.pth"},
    @{Url="https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth"; File="gfpgan\weights\detection_Resnet50_Final.pth"},
    @{Url="https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth"; File="gfpgan\weights\GFPGANv1.4.pth"},
    @{Url="https://github.com/xinntao/facexlib/releases/download/v0.2.2/parsing_parsenet.pth"; File="gfpgan\weights\parsing_parsenet.pth"}
)

Write-Host "Downloading main models..." -ForegroundColor Cyan
foreach ($model in $models) {
    Download-File -Url $model.Url -OutFile $model.File
}

Write-Host ""
Write-Host "Downloading GFPGAN enhancer models..." -ForegroundColor Cyan
foreach ($model in $enhancerModels) {
    Download-File -Url $model.Url -OutFile $model.File
}

Write-Host ""
Write-Host "Download completed!" -ForegroundColor Green
Write-Host "Check the checkpoints and gfpgan\weights folders for downloaded models." -ForegroundColor Cyan

# Show file sizes
Write-Host ""
Write-Host "Downloaded files:" -ForegroundColor Yellow
Get-ChildItem -Path "checkpoints" -File | ForEach-Object { Write-Host "  $($_.Name) - $([math]::Round($_.Length/1MB, 2)) MB" }
Get-ChildItem -Path "gfpgan\weights" -File | ForEach-Object { Write-Host "  $($_.Name) - $([math]::Round($_.Length/1MB, 2)) MB" }

Read-Host "Press Enter to continue"
