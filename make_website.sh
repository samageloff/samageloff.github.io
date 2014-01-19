#!/bin/bash
echo You are making your website
echo ---------------------------

cd Sam
echo Harp Compile
NODE_ENV=production harp compile
grunt uglify
echo Move to Git repo
cd ~/Git
pwd
echo Remove current clone
rm -rf samageloff.github.io/
echo re-clone
git clone https://github.com/samageloff/samageloff.github.io.git
cd /Users/samuelageloff/Sites/www-root
echo Migrate files from /www
cp -r Sam/www/ /Users/samuelageloff/Git/samageloff.github.io/
echo Removing node_modules dependencies from copy
cd ~/Git/samageloff.github.io/
rm -rf node_modules Gruntfile.js package.json
# rsync -av --exclude='Sam/node_modules/' --exclude='Sam/www/node_modules/' Sam/www/ /Users/samuelageloff/Git/samageloff.github.io/
echo Adding new files
cd ~/Git/samageloff.github.io/
git add -A
echo Applying commit message: $1
git commit -m"$1"
echo Pushing files to origin master
git push origin master
echo Pushing complete!
echo -----------------
echo Now copying files to Dropbox for backup
cd /Users/samuelageloff/Sites/www-root
cp -r Sam/ /Users/samuelageloff/Dropbox/Home/personal/website