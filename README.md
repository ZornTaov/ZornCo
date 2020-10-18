# ZornCo MVC Website


### To Update

First make sure your repository has the latest changes:
```console
git pull
```

Stop and remove the running website image:
```console
docker container stop website
docker container rm website
```

Then rebuild the latest image for the website:

```console
docker-compose build
```

Finally, re-deploy the new image:
```console
docker create --name website -p 80:80 zornco-site:latest
docker start website
```
