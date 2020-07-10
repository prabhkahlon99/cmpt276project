**Document Header **

Platformer Game 06/22/2020 Version: 0.0

Platformer Game 07/08/2020 Version 1.0


    **Project Abstract**

This project will be a platformer game in which the player controls a character going through various obstacles in order to reach a goal screen/goal state. There will be pickups of food/water along to the way to maintain the character’s nourishment. Depleting these resources or falling off the map will result in a small setback in time. These runs will be timed. In a single-player instance, the user will be playing against themselves in the essence of trying to get the lowest time possible, while in the multiplayer setting, the users will be racing against the others in order to see who could reach the end state the fastest. We will use OpenWeatherMap API and Phaser 3 as our game engine in order to have a dynamic background for the game. 

**Customer **


    The customer for this software is most likely to be a younger audience where the most common age groups are from ages 7-22. This software is intended for gamers both hardcore and casual and mostly younger people who have a lot of free time and do not need to invest a lot of resources to learn how to play. That is the target audience however the game is simple enough to play that it could be played by anyone in their free time.


    **Competitive Analysis **


    Our competitors are any other companies who make platforming games. Most platforming games are single-player and don’t have many real-time features. The real-time features we plan to implement are chat and multiplayer. Another feature that stands out from the competition is the competitive nature of our game. Not many platformers have a race to the end.


    **User Stories**



*   Administrator Role:
    *   Name: Admin
    *   Triggers/Preconditions: Access the Admin state through the Admin Account’s USERNAME and PASSWORD. Upon entering an admin user’s credentials, the admin will then be greeted with an administrator landing page. (Iteration 1 / 2)
        *   The administrator login will be given and there is no method to create an Administrator account. All accounts created through account creation will be defaulted to the basic user. (Implemented in Iteration 1)
        *   View all users and see who else has access to the system. (Implemented in Iteration 1)
    *   The administrator account will NOT have special privileges within the game state, and will have the same limitations within the game as all other Standard User Roles (explained below). However, the Administrator’s added benefit is being able to see all registered users. (Planned for Iteration 2)
    *   The administrator will have the ability to remove pre existing users within the registered users database. (Planned for Iteration 2)
    *   Test: Using the admin login page verify that only the admin account is able to connect to the admin landing page. (Planned for iteration 2)
*   Standard User Role:
    *   Name: User
    *   Triggers/Preconditions: Access the DEFAULT landing page of the website as well as the basic functionality of the game. Within this specific user, they DO NOT have administrator privileges and therefore cannot see all registered users (As mentioned for the administrator role) (Implemented in Iteration 1)
    *   The Standard User Role is accessed through creating an account through the account creation page. Within this page, they will be creating a Standard User account. (Implemented in Iteration 1)
        *   All created users within the Account Creation page will be considered a Standard User account, and all of these accounts will have the same functionality/limitations. (Implemented in Iteration 1)
            *   These accounts can ONLY access the game, everything on the frontend. They cannot access backend data. (Planned for iteration 2)
    *   The Standard User role does NOT have any special permissions and can only access the basic basic game. (Planned for iteration 2)
    *   This USER will have stats saved that will be tied with their account. They will be able to view these stats, and perhaps a leaderboard, but they will NOT be able to edit/change/update the stats of ANOTHER user through playing the game. (The user will only be able to play the game on their own account. In order to access another account, they will need the credentials for the other account.) (Planned for Iteration 3)
    *   Test: Check if a user is logged into the game by seeing if their id matches that in the database. (Planned for iteration 2)

**User Interface Requirements **


    As of iteration zero, the only UI plan we have is a login screen. The main login will look something like the image below.

As of iteration 1 the UI for the login and register pages are the same as the images below