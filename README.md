### Team 21 Term Project

#### Instructions
If `python --version` returns a version `< 3.0`, run `python -m SimpleHTTPSever` from the project directory, then go to [localhost:8000](http://localhost:8000) to access the project.
If your version is `>= 3.0`, run `python -m http.server` and go to the [same URL](http://localhost:8000).
Or on Mac/Linux, `if [ $(python --version 2>&1 | tr -dc '0-9') -lt 300 ]; then python -m SimpleHTTPServer; else python -m http.server; fi`
Controls for the game are provided on the menu screen.
 * * *
##Welcome to the Amazing NASA Universe Simulator™

This simulator is designed to be used as an 100% realistic space-based training program.

Your job is to train to be the best NASA spaceship pilot in the galaxy. To complete the simulation, you must navigate your spaceship through the expertly and rigorously designed test levels and reach the exit. 

You can choose one of two modes to start the simulation in: Normal Mode and Skill Mode. Normal mode allows to nagivate the levels as they are. This is designed to purely test your spaceship flying skills. Skill mode allows you to redesign your current level by placing addition planets in space. Use this ability to take advantage of the physics of the level and minimize your fuel usage. 

To fill up on fuel, pick up any of the fuel pick-ups that are placed in the level. Points will be awarded based on conservative fuel usage and pick-ups obtained. Points will directly be viewed by supervisors as a measure of your aptitude.

_Minimal points may result in your immediate suspension from the NASA training program._

#### Controls
|Key | Function |
|-------- | ----------------|
|`UP ARROW`|Increase thrust|
|`DOWN ARROW` | Decrease thrust|
|`LEFT ARROW` | Rotate heading left|
|`RIGHT ARROW` | Rotate heading right|
|`Z` | Inertial dampeners|
|`X` | Reset thrust|
|`R` | Reset level|
