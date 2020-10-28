# ZornCo MVC Website


### To Update

First make sure your repository has the latest changes:
```console
git pull
```

Stop and remove the running website image:
```console
docker-compose down
```
Then rebuild the latest image for the website:
```console
docker-compose build
```
Re-deploy the new image:
```console
docker-compose up -d
```
