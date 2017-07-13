cd ./_book
git init
git remote add origin https://github.com/yuanwen0327/jQuery_plugin_wheels.git
git checkout -b gh-pages
git add .
git commit -m 'upload'
git push origin --delete gh-pages
git push --set-upstream origin gh-pages