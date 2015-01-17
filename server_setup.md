#CrowdCalendar Vagrant Installation Documentation

Install Virtual Box: https://www.virtualbox.org/wiki/Downloads

Install Vagrant: https://www.vagrantup.com/

Open your command prompt (protip: if in Windows, use Powershell because it has bash-like commands), navigate to your CrowdCalendar directory, then run "vagrant up". This may take a while, as it literally downloads the iso for the Virtual Box machine, installs it, runs scripts, and logs in. Note that the script may error a couple times while waiting for the box to setup SSH.

Open an SSH client and SSH into your Vagrant machine at 127.0.0.1:2222. The username and password are both "vagrant" without quotes.

Navigate to the "nodeserver" directory with "cd /nodeserver". "/nodeserver" is the directory where the Express server is located.

Node modules now need to be installed. They need to be installed in the nodeserver directory using "sudo npm install --no-bin-links" to keep them portable. (IMPORTANT: --no-bin-links NEEDS to be used within the shared folder when installing any npm module, or else npm will throw an error).

Now that you have the modules installed, run the server from the "nodeserver" directory using "node app.js". If you are using nodemon or forever (which refresh the server when you make changes to files), launch the server using "nodemon app.js" or "forever start app.js". Otherwise keep in mind that you will have to shut down the node server with ctrl+c and restart it with "node app.js" in order to see some of your newest changes.

Access the server by pointing your browser to 192.168.33.10:4000

##Developing on the server

The "server" directory in the CrowdCalendar folder on your machine is synced to the "nodeserver" directory on the Vagrant virtual machine as you use it. This means you can develop on your local machine in your local enviroment, sync to GitHub, and everyone else will see your changes on their standardized virtual machines when they sync back. Keep in mind that any change to the CrowdCalendar website itself will be made within the "server" directory, as any change outside of it will not be synced.

NOTE: If you want to install an additional npm module for the project, make sure you use the "--save-dev" argument so that the module is saved in the package.json file, which makes it portable and able to be easily installed by others working on the project.