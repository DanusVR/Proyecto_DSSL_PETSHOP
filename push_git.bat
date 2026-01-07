@echo off
git init
git remote remove origin
git remote add origin https://github.com/DanusVR/Proyecto_DSSL_PETSHOP.git
git checkout -b Version_2
git add .
git commit -m "feat: migrate to MEAN stack - Version 2"
git push -u origin Version_2
