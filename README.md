# Network Mapper
 
## Capstone project for Galvanize Immersive Software Development Bootcamp
## SDI 17 - 2023

* This capstone project was built over a two week sprint at the end of our full stack bootcamp. 
* The bootcamp used agile methodologies throughout. At the beginning of the project we conducted sprint planning. We conducted daily stand-ups and a review at the end. I acted as the project manager throughout the capstone.

### Contributers:

* [Sean McLeaish](https://github.com/SMcLeaish/)
* [Chris Woller](https://github.com/WollerChris)
* [Cameron Wills](https://github.com/CTWills)
* [Cadenw Kulp](https://github.com/cadensstudio)
* [Cade Wied](https://github.com/Cade3031)
* [Chris Raizk](https://github.com/craizk)

## Purpose

Network mapper was designed to bring together network analysis tools and mapping capabilities. 

## Method

* A postgresql database holds a network of people and organizations. It draws connections between these people based on events and interactions. 

* A React SPA uses a searchable leaflet map as a landing page displaying the entities in the database

* When selected a recursive javascript function determines every entity with a relationship with the selected entity, and then every entity with a relationship with the next entity, until a table is built of the entire network.

* The network is sent to a python microservice and analyzed using networkx. Network analysis metrics are added to the entities. 

* The weighted network is returned to the SPA where it is visualized using cytoscape.javascript

## Installation and Use

* Clone the repository

### Server: 
* create a .env file with the value
`DB_CONNECTION_STRING = postgresql://myusername:mypassword@localhost:5432/mydatabase`
and the values changed to your own unique values inside of the server directory.

* bring up a docker container running postgresql with your values
`docker run --name mypostgres -e POSTGRES_DB=mydatabase -e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres`

* start the server 

### Server:
Navigate to the server directory

`npm i`

`npm start`

### Frontend:
Navigate to the client directory

`npm i`

`npm start`

### Python service:
Navigate to the python_services directory

`pip install -r requirements.txt`

`python server.py`

*The client can now be reached at localhost:3000*

## Screenshots
![image](https://github.com/SMcLeaish/network-mapper/assets/125446030/5339e4de-c273-4726-9c72-5badf87a395b)
![image](https://github.com/SMcLeaish/network-mapper/assets/125446030/ae657c15-01be-414b-81ed-30589cea617a)
![image](https://github.com/SMcLeaish/network-mapper/assets/125446030/3c65d084-c0ce-422d-abe1-f36d58e2e0db)




