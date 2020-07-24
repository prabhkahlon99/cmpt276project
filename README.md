**Document Header**

Platformer Game 06/22/2020 Version: 0.0

Platformer Game 07/08/2020 Version 1.0


**Project Abstract**

This project will be a platformer game in which the player controls a character going through various obstacles in order to reach a goal screen/goal state. There will be pickups of food/water along to the way to maintain the character’s nourishment. Depleting these resources or falling off the map will result in a small setback in time. These runs will be timed. In a single-player instance, the user will be playing against themselves in the essence of trying to get the lowest time possible, while in the multiplayer setting, the users will be racing against the others in order to see who could reach the end state the fastest. We will use OpenWeatherMap API and Phaser 3 as our game engine in order to have a dynamic background for the game. 

**Customer**


The customer for this software is most likely to be a younger audience where the most common age groups are from ages 7-22. This software is intended for gamers both hardcore and casual and mostly younger people who have a lot of free time and do not need to invest a lot of resources to learn how to play. That is the target audience however the game is simple enough to play that it could be played by anyone in their free time.


**Competitive Analysis**


Our competitors are any other companies who make platforming games. Most platforming games are single-player and don’t have many real-time features. The real-time features we plan to implement are chat and multiplayer. Another feature that stands out from the competition is the competitive nature of our game. Not many platformers have a race to the end.

**Velocity Measurement Legend:**

We will be using a scale from 1 to 5 (1, 2, 3, 4, 5) which corresponds to how difficult a certain portion will be to implement. For a portion/feature that will be extremely easy to implement, it will have a Velocity score of 1. For something that is extremely difficult to implement, it will have a velocity score of 5.


**User Stories**

*   Administrator Role:
    *   Name: Admin
    *   Triggers/Preconditions: Access the Admin state through the Admin Account’s USERNAME and PASSWORD. Upon entering an admin user’s credentials, the admin will then be greeted with an administrator landing page. (Iteration 1 / 2)
        *   The administrator login will be given and there is no method to create an Administrator account. All accounts created through account creation will be defaulted to the basic user. (Implemented in Iteration 1)
        *   View all users and see who else has access to the system. (Implemented in Iteration 1) 
            *   Velocity Rating: 1
        *   Can add, delete, search the new admin and public users using users unique assigned id(implemented in iteration 2)
        *   Can access the game page through the admin dashboard and the public users’ dashboard.
    *   The administrator account will NOT have special privileges within the game state and will have the same limitations within the game as all other Standard User Roles (explained below). However, the Administrator’s added benefit is being able to see all registered users. (Planned for Iteration 2)
    *   The administrator will have the ability to remove pre-existing users within the registered users’ database. (Planned for Iteration 2)
    *   The admin will be able to reset their password in case someone forgets it. (Planned for iteration 3)
    *   Test: Should login a registered admin and take them to the admin landing page. Added test in test/user-tests.js
    *   Velocity Rating 2
*   Admin User Search
    *   Name: Search Users
    *   Actors: This is accessed through the Admin login which is done through the login page. The Administrator is the actor.
    *   Actions/Post Conditions: Within the Admin page, they are able to search and see all registered users. These are all the users that are registered and that exist within the database. The administrator can search the users using the unique user’s id and can check its rights and other attributes assigned. The administrator can also search the users using the unique user’s id and can check its rights and other attributes assigned. After the Admin wants to see all the users or see a specific user’s ID, the user will be displayed. 
    *   Test: Should find a user with a given id that exists in the database and display it. Added test in test/user-test.js
    *   Iteration: Done in Iteration 2
    *   Velocity Rating: 2
*   Admin User Add
    *   Name: Add Users
    *   Actors This is accessed through the Admin login which is done through the login page. The Administrator is the actor.
    *   Actions/Post Conditions: Within the Admin page, they are able to add new users. Furthermore, the admin will have finer control over the new user’s details such as their roles. Upon adding a user, the user will then be added to the database that contains all other registered users. (This is different from creating a new user on the main landing page)
    *   Test: Should add a single public user on a successful POST request and redirects and renders the admin register page. Added test in test/user-test.js
    *   Iteration: Done in Iteration 2
    *   Velocity Rating: 2
*   Admin User Delete
    *   Name: Delete Users
    *   Actors: This is accessed through the Admin login which is done through the login page. The Administrator is the actor.
    *   Actions/Post Conditions: Within the admin page, the Admin is able to remove any user that exists within the users database. The admin will then be able to select a user to delete and will have the option to remove the user from the database. If the user is removed, then the user would no longer exist in the database. The administrator will have the ability to delete pre-existing users within the registered users’ database using their unique assigned id with an exception of the main admin user. The main admin has id 0 and he cannot be deleted as he is the main administrator.
    *   Iteration: Done in Iteration 2. 
    *   Velocity Rating: 1
*   Admin Global Password Reset (Planned for Iteration 3)
    *   Name: Reset Passwords
    *   Actors: The Admin and the users will be involved. The user may request a password reset, and the admin will then be able to perform such a reset.
    *   Actions/Post Conditions: The admin will be able to reset  a user’s password. After the task is done, the user will have a new password that they remember or through the webpage they will be able to recreate a password. 
    *   Iteration: Planned for iteration 3. 
    *   Velocity rating 3.
        *   This should not be too difficult to implement, as it will take the user’s password field and allow the user to update it. This will be extremely similar to editing a value like Assignment 2 (Dealing with databases)
*   Standard User Role:
    *   Name: User
    *   Triggers/Preconditions: Access the DEFAULT landing page of the website as well as the basic functionality of the game. Within this specific user, they DO NOT have administrator privileges and therefore cannot see all registered users (As mentioned for the administrator role) (Implemented in Iteration 1)
    *   The Standard User Role is accessed by creating an account through the account creation page. Within this page, they will be creating a Standard User account. (Implemented in Iteration 1)
        *   All created users within the Account Creation page will be considered a Standard User account, and all of these accounts will have the same functionality/limitations. (Implemented in Iteration 1)
            *   These accounts can ONLY access the game, everything on the frontend. They cannot access backend data. (Planned for iteration 2)
    *   The Standard User role does NOT have any special permissions and can only access the basic game. (Planned for iteration 2)
    *   The Standard User role does NOT have any special permissions and can only access the basic game. (implemented in iteration 2)
    *   This USER will have stats saved that will be tied with their account. They will be able to view these stats, and perhaps a leaderboard, but they will NOT be able to edit/change/update the stats of ANOTHER user through playing the game. (The user will only be able to play the game on their own account. In order to access another account, they will need the credentials for the other account.) (Planned for Iteration 3)
    *   The User will be able to reset their password in case someone forgets it. (Planned for iteration 3)
    *   Test: Should login a registered user and take them to the game homepage. Added test in test/user-tests.js.
*   Weather User Story
    *   Name: Weather
    *   Actors: User and OpenWeatherMaps API
    *   Actions/Post Conditions: The weather is seen when the user first logs in and is greeted with the game space. Here, the user will see a background that is reflective of the current local weather (Local to Vancouver). This is done through parsing the data from the OpenWeatherMaps API which provides all local weather in an easy to read/access JSON format. The data was accessed through Ajax, from which the parameter “async” was set to false, to allow for the variables to be accessed later on. The data was then set to variables so that the values could be accessed later. The 3 key weather features used were temperature, clouds, and overall condition. These 3 were set to variables which were later compared to determine which background to use. The temperature, cloudiness, and overall condition each contributed to determining which background image is chosen. 
    *   Test: Gave various boundaries for temperature, cloudiness, and overall conditions. (Used fake/temporary conditions to check that each of the backgrounds could properly be accessed). As of this test, the current temperature is 17.34 degrees celsius, the cloud level is 16 and the overall condition is “Clear”. The temperature exceeds the “if check” of 15 degrees celsius and the cloudiness level falls below the “if check” of 20, and the overall condition (status) is “Clear”. As such, The temperature is considered ClearBlue, and therefore, the background of ClearBlue is used, which is a plain blue sky.
    *   Iteration: Done on iteration 2. Velocity Rating 3
*   Movement User Role:
    *   Name: Movement checker 
    *   Actors: Users participating in gameplay
    *   Actions/Post Conditions: The user plays as a viking character within a map with several platforms located above him. The characters movement is fully functional and is controlled by the user through arrow keys with the option to move right, left, jump and increase fall speed. The right and left keys trigger a 9 frame animation sequence that is displayed in succession to create a walking animation. The animation loops while the arrow keys are pressed and finishes the 9 frame sequence and stops looping when the key is no longer being used. Two separate animations are implemented for the viking one for walking left and one for walking right to create the appearance of turning around when shifting from left to right. To travel above the map the user must use the up arrow key to land on platforms. The platforms are set to collide with the viking to so that the character can jump onto the platform without phasing through and allowing the user to traverse through the map. Gravity is active on the character which makes the character fall once at the apex of their jump and can be accelerated by pressing the down arrow key. The viking speed is set at 100 which allows him to move at a medium and easily controllable speed.
    *   Test: Check if arrow keys correctly trigger correct character animation and character movement.
    *   Iteration: Done on iteration 2. 
    *   Velocity Rating: 4
*   Power Up User:
    *   Name: Powerup checker 
    *   Actors: Users participating in gameplay
    *   Actions/Post Conditions: The user plays as a viking character within a map with several platforms located above him. The characters movement is fully functional and is controlled by the user through arrow keys with the option to move right, left, jump and increase fall speed. Gravity is active on the character which makes the character fall once at the apex of their jump and can be accelerated by pressing the down arrow key. The viking speed is set at 100 which allows him to move at a medium and easily controllable speed. By picking up the water bottle power up the player is able to move at a speed of 300 instead of 200 and their ability to jump and accelerate towards the ground is also increased. The power up lasts for 8 seconds and can be picked up anytime after it spawns.
    *   Test: Should power up the player for 8 seconds.
    *   Iteration: Done on iteration 2. 
    *   Velocity rating: 2
*   Throw axe to kill monster
    *   Name: Kill monster
    *   Actors: Users controlled characters and mindless monsters controlled by computer. The actor is the user controlling the character.
    *   Actions/Post Conditions: The user plays as a viking character within a map with several platforms located above him. The characters movement is fully functional and is controlled by the user through arrow keys with the option to move right, left, jump and increase fall speed. Gravity is active on the character which makes the character fall once at the apex of their jump and can be accelerated by pressing the down arrow key. The viking is able to throw an axe towards the mouse pointer when the left mouse button is clicked. If the monster is hit by the viking then the monster is destroyed.
    *   Test: It should destroy a monster.
    *   Iteration: Done iteration 2.
    *   Velocity Rating: 5
*   Monster Interaction User Role:
    *   Name: Monster Interaction checker 
    *   Actors: Users participating in gameplay
    *   Actions/Post Conditions: When the user starts the game a monster will spawn at the top platform of the map. Unlike the main character the monster is not controllable and moves automatically. Similar to the viking the monster and the platforms are designed to collide with each other to prevent phasing through platforms. The monster starts off moving rightwards and has a 9 frame walking animation that is displayed in sequence similar to the viking. Whenever the monster collides with either bounds of the map the monster turns around and its movement and animation switch to the opposite of what it just was. The monster can only interact with the player by colliding with viking when it’s being blocked in which case it continues to walk in spot until the user moves the viking. In the future the monster will be given a feature to attack the user when colliding. The monster moves at a speed of 100 and has a falling speed of 100.
    *   Test: Start up game and see if monster is able to correctly respond to walking to edge of maps and 
    *   Iteration: Done on iteration 2. 
    *   Velocity Rating 4
    
**User Interface Requirements**

As of iteration zero, the only UI plan we have is a login screen. The main login will look something like the image below.

![alt_text](mdImages/image1.png "iteration 0")

As of iteration 1 the UI for the login and register pages are the same as the images below

![alt_text](mdImages/image4.png "iteration 1")
![alt_text](mdImages/image5.png "iteration 1")

For iteration 2 and beyond please view submitted pdf for user interface requirement mock-up images
