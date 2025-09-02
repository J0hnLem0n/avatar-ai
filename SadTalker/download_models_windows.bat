@echo off
echo Creating directories...
mkdir checkpoints 2>nul
mkdir gfpgan\weights 2>nul

echo Downloading SadTalker models...
echo.

echo Downloading mapping_00109-model.pth.tar...
curl -L -o checkpoints\mapping_00109-model.pth.tar https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00109-model.pth.tar

echo Downloading mapping_00229-model.pth.tar...
curl -L -o checkpoints\mapping_00229-model.pth.tar https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00229-model.pth.tar

echo Downloading SadTalker_V0.0.2_256.safetensors...
curl -L -o checkpoints\SadTalker_V0.0.2_256.safetensors https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_256.safetensors

echo Downloading SadTalker_V0.0.2_512.safetensors...
curl -L -o checkpoints\SadTalker_V0.0.2_512.safetensors https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_512.safetensors

echo.
echo Downloading GFPGAN enhancer models...
echo.

echo Downloading alignment_WFLW_4HG.pth...
curl -L -o gfpgan\weights\alignment_WFLW_4HG.pth https://github.com/xinntao/facexlib/releases/download/v0.1.0/alignment_WFLW_4HG.pth

echo Downloading detection_Resnet50_Final.pth...
curl -L -o gfpgan\weights\detection_Resnet50_Final.pth https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth

echo Downloading GFPGANv1.4.pth...
curl -L -o gfpgan\weights\GFPGANv1.4.pth https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth

echo Downloading parsing_parsenet.pth...
curl -L -o gfpgan\weights\parsing_parsenet.pth https://github.com/xinntao/facexlib/releases/download/v0.2.2/parsing_parsenet.pth

echo.
echo Download completed!
echo Check the checkpoints and gfpgan\weights folders for downloaded models.
pause
