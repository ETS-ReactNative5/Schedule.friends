# Schedule.friends 

## Navigation
* [Description](#description)
* [Before Setup](#before-setup)
* [First Time Frontend Setup](#first-time-frontend-setup)
	* [Environment Setup](#environment-setup)
	* [Dependencies](#installing-frontend-dependencies)
* [First Time Backend Setup](#first-time-backend-setup)
	* [Django Setup](#django-setup)
	* [Virtual Environment Setup](#virtual-environment-setup)
* [Running The Application](#running-the-application)
	* [Frontend](#frontend) 
	* [Backend](#backend) 
	
## Description

Schedule.friends is a mobile app that helps you know when your friends are free on an easy to view interface. Aimed towards students, we hope to clear out some of the hassle of coordinating meetups when everyone has a different schedule.

## Before Setup
1. Note that we will be using the terminal on Mac/Linux and Powershell on Windows. 
2. Clone the repository using Git or download the repository zip file. 
###
	git clone https://github.com/Alyssa-Ma/Schedule.friends.git 
	
[Back to Navigation](#navigation)

## First Time Frontend Setup

### Environment Setup
1. If you do not have Node.js installed, install the LTS version. 

	https://nodejs.org/en/
	
1. Go to the link below to set up the environment. 

	https://reactnative.dev/docs/environment-setup
3. Choose `React Native CLI Quickstart`

	#### For Windows/Linux
	1. Choose your computer's operating system as the Development OS and Android as the target OS.
	2. Follow all steps in the `Installing dependencies` section.
	3. Follow all steps in the `Android development environment` section.
	4. Skip the `Creating a new application` section.
	5. Follow all steps in the `Preparing the Android device` section for either a physical or virtual device. 
	
	#### For Macs
	1. Choose macOS as the Development OS and iOS as the target OS.
	2. Follow all steps in the `Installing dependencies` section.
	3. When you install an iOS Simulator in Xcode, use an iPhone 12 with iOS 14.5 on the virtual device.
	4. Use the command `open -a simulator` in the terminal to open the simulator.
	
[Back to Navigation](#navigation)

### Installing Frontend Dependencies
1. Navigate into the frontend folder inside the repository using your terminal of choice.
###
	cd .\frontend\
2. Your terminal should have \Schedule.friends\frontend as the path now. Now we need to install the dependencies.
###
	npm install
3. We also need a .env file in the frontend to connect to the backend. Create a file in the frontend file named `.env` Edit the file, paste and save the following line. NOTE: You may need to add a new line under this. Press `ENTER` once after copying the text below.
###
	BASE_URL=http://10.0.2.2:8000/api/sf_users

NOTE: You may need a blank newline below the `BASE_URL` for the file to be read properly.  
4. **For Macs** 
   Use the following command in the terminal while it is still in the frontend folder.  
####
	npx react-native unlink react-native-vector-icons  
  Use the following command in the terminal.  
####
	cd ios && pod install && cd ../  

***Congratulations you are now done setting up the frontend!***

[Back to Navigation](#navigation)

## First Time Backend Setup

### Django Setup
1. If you do not have Python version 3 or higher installed, install it. If you are using Windows, Make sure Python can be used in your terminal as a PATH variable. NOTE: It’s very likely you have it installed. Typically you can check by going into your terminal and typing `python --version`. Could also be `python3 --version`. Otherwise, google how to check if you do.

	https://www.python.org/downloads/

2. After that, if you don’t have postgresql installed, you’ll need to do that, and it will vary based on what OS/environment you want to use.

	https://www.postgresql.org/download/

3. Start your postgres server. When you install and start your postgreSQL service, make note of the port number, we will need this later when we set up our dotenv file.

4. After that’s done, you’ll need to create your database manually, which requires going into postgresql(psql) shell. While creating the databse, make note of:
###
	Name of database
	Name of user with permissions created
	Password of the user

As we will need them later for you dotenv file.

5. Enter your shell either through your app shortcut or entering `sudo -u postgres psql` for Mac/Linux terminals. Then run:
###
	CREATE DATABASE sf_api;

6. Then you'll need to create a user to access and modify the database.
###
	CREATE USER <username> WITH PASSWORD <password>;

7. Alter the following roles of your user:
###
	ALTER ROLE <yourname> SET client_encoding TO 'utf8';
	ALTER ROLE <yourname> SET default_transaction_isolation TO 'read committed';
	ALTER ROLE <yourname> SET timezone TO 'UTC';

8. Grant privileges to the database for your new user:
###
	GRANT ALL PRIVILEGES ON DATABASE helloworld TO <yourname>;

And then exit your terminal with `\q`.

[Back to Navigation](#navigation)

### Virtual Environment Setup

1. Once the database is set up, we need to create our python environment. Navigate in your terminal to 
###
	/Schedule.friends/backend

2. From there, create your virtual environment by using the command below. (You may need to type python3 depending on your setup).
###
	python -m venv venv

3. Then you need to activate it by using the command below. 
#### Mac/Linux
	. venv/bin/activate
	
#### Windows
	.\venv\Scripts\activate
	
You’ll know it works when there’s a (venv) in the start of your terminal path. To get out of your env, just type `deactivate`.

4. While your virtual environment is still activated, install all the dependencies needed for the django app to run by using the command below. NOTE: if you use python3 as your command instead of python, you will use pip3 instead of pip.
###
	pip install -r requirements.txt

5. Now we need to create an dotenv file. In the same directory `(/Schedule.friends/backend)`, create a file named `.env` (exactly as it is written). 

6. Open the file in any plain text editor and put in the following variables:
###
	SECRET_KEY_DJANGO='django-insecure-wa=kucz290j!8wnr8k5$aezj2woc$xu@^qz5m=d%6nx!9k_vt2'
	NAME_PSQL=<Name of database you created in step 4>
	USER_PSQL=<Name of user you created in step 4>
	PASSWORD_PSQL=<Password of user you created in step 4>
	HOST_PSQL=localhost
	PORT_PSQL=<Port your PostgreSQL service runs on>

NOTE: You may need a blank newline below the `PORT_PSQL` for the file to be read properly.

7. Save the file.

8. You then need to run migrations to configure your postgresql database to work with the model schema we’ve created. Navigate into `/Schedule.friends/backend/sf_api` and type the following:
###
	python manage.py migrate

9. If you want some seed data to start with, you can use the following commands:
###
	python manage.py seed --mode==refresh

This will clear the database then propagate users with different schedules, friend_lists, and friend_requests.

###
	python manage.py seed --mode==clear

Will clear the database.

10. At this point you should be able to run the backend. Navigate into /Schedule.friends/backend/sf_api and type the following command:
###
	python manage.py runserver

11. If all works, django will run without any errors. You can test to see if the database is working as intended by typing `http://127.0.0.1:8000/api/sf_users/` into your web browser.

12. If you wish test the paths with curl or postman, you'll need to an authorization token in your header for all of the paths (except for POST `http://127.0.0.1:8000/sf_users/create`). You can either retrive a token from the login path at by sending a POST request to `http://127.0.0.1:8000/api/sf_users/login` with the body:
###
	{
		"username": "<username>",
		"password": "<password>"
	}

Or by creating a user with the POST request at `http://127.0.0.1:8000/sf_users/create` with the following body:
###
	{
		“first_name”: “<first name>”,
		“last_name”: “<last name>”,
		“email” : “<proper email address>”,
		“password”: “<password>”,
		"schedule": []
  	}
  
13. Full list of paths are located in `backend/sf_api/sf_api/urls.py`.

14. To deactivate the server, use `CTRL-C`.

[Back to Navigation](#navigation)

## Running The Application
	
### Frontend
1. Navigate into the frontend folder inside the repository using your terminal of choice.
###
	cd .\frontend\
1. Enter the following command with the terminal in the frontend folder.
###
	npx react-native start
2. While leaving the first terminal running, open on another terminal in the frontend folder. Run the command based on which virtual device OS you're using.
### Android
	npx react-native run-android
### iOS
	npx react-native run-ios
	
***The frontend is now running.***	

[Back to Navigation](#navigation)

### Backend
1. Navigate into the backend folder inside the repository using your terminal of choice. 
###
	cd .\backend\
2. Activate the virtual environment by using the command below. 
#### Mac/Linux
	. venv/bin/activate
	
#### Windows
	.\venv\Scripts\activate
3. Navigate into `/Schedule.friends/backend/sf_api` and type the following command:
###
	python manage.py runserver
***The backend is now running.***	

[Back to Navigation](#navigation)	
