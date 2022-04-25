# csc2005-team07-2021

## Project Setup

```
npm install
npm install concurrently
cd client
npm install
cd ..
npm run dev
```

Import and run SQL query in your MySQL server <br>
please see the following link to install MySQL <br>
https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-install-archive.html <br>

Edit /client/appConfig.json <br>
include your proxy address to point to Express.js server <br>
include your database credentials, which the Express.js server will connect to<br>
![image](https://media.discordapp.net/attachments/772003864891097099/909312750977712128/unknown.png)

<br>
Edit /client/package.json <br>
with the same proxy address for Reactjs to access your server's proxy <br>

![image](https://media.discordapp.net/attachments/772003864891097099/909303257992675348/unknown.png)

