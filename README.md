### Entity framework

- list dotnet tool (global)

      $ dotnet tool list --global

- install dotnet-ef

      $ dotnet tool install dotnet-ef --global --version 5.0.4

- update dotnet-ef

      $ dotnet tool update dotnet-ef --global --version 5.0.4

- migrations

      $ dotnet ef migrations add InitialCreate -p Persistence -s API

- drop 

      $ dotnet ef database drop -s API -p Persistence

---
### git

- ignore

      $ dotnet new gitignore

---

### wsl for windows 10

  - [setup](https://docs.microsoft.com/zh-tw/windows/wsl/install-win10)

  - [reset ubuntu password as if existed](https://docs.microsoft.com/zh-tw/windows/wsl/user-support) 

        $ wsl -u root

        $ passwd <username>
  
  - version

        # lsb_release -a

  - install docker 
        
        # sh install-docker.sh

        # sudo service docker start

        # sudo systemctl enable docker

---

### docker

- build images (producton)

      $ docker build -t lasting/reactivities .

- volumes create

      $ docker create volume mssqlsystem

      $ docker create volume mssqluser

- database (mssql)

      $ docker run -p 1433:1433 -v mssqlsystem:/var/opt/mssql -v mssqluser:/var/opt/sqlserver -e ACCEPT_EULA=Y -e SA_PASSWORD=Pa$$w0rd --name msdb mcr.microsoft.com/mssql/server

---
### docker-compose

- [resolve volume issues mssql used](https://sqldbawithabeard.com/2019/03/26/persisting-databases-with-named-volumes-on-windows-with-docker-compose/)

- inspect volume

      $ docker volume inspect mssqlsystem

      $ docker volume inspect mssqluser

- see docker-compose.debug.yml

- start docker-compose (dev)

      $ docker-compose -f "docker-compose.dev.yml" up -d --build

      $ docker-compose -f "docker-compose.dev.yml" ps

      $ docker-compose -f "docker-compose.dev.yml" logs app

      $ docker-compose -f "docker-compose.dev.yml" down

- start docker-compose (debug)

      $ docker-compose -f "docker-compose.debug.yml" up -d --build

- issues 

  - [why docker ignore files still exist](https://stackoverflow.com/questions/60713751/where-to-put-dockerignore) : 

      - volume mount overrides the contents of the image for that container.

      - .dockerignore needs to be in the root of your [build context]. Dockerfile with .dockerignore must the same folder layer.

- refs

  - https://www.mattbutton.com/docker-for-web-developers/

---
### react

- create with typescript

      $ npx create-react-app client-app --use-npm --template typescript

- dependencies

      $ npm install axios

      $ npm install semantic-ui-react semantic-ui-css

      $ npm install mobx mobx-react-lite

      $ npm install react-router-dom

      $ npm install react-calendar

      $ npm install react-toastify

      $ npm install formik

      $ npm install yup

      $ npm install datepicker
      
### References

- [Udemy courses](https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react/)

- [Docker](https://www.docker.com/get-started)

- [Kubernetes](https://kubernetes.io/)