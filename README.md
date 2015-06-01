# Amazing NASA Universe Simulator™
### Team 21 Term Project

#### Instructions
If `python --version` returns a version `< 3.0`, run `python -m SimpleHTTPSever` from the project directory, then go to [localhost:8000](http://localhost:8000) to access the project.
If your version is `>= 3.0`, run `python -m http.server` and go to the [same URL](http://localhost:8000).
Or on Mac/Linux, `if [ $(python --version 2>&1 | tr -dc '0-9') -lt 300 ]; then python -m SimpleHTTPServer; else python -m http.server; fi`
Controls for the game are provided on the menu screen.
 * * *
#### TODO:
  * Requirements:
    * ~~Lighting~~
    * Collision Detection
      * ~~With planets~~
      * ~~With skybox (plus "warning" system?)~~
    * ~~Gravity~~
    * Remove planets on normal level completion
  * Logistical:
    * Populate level data
     * Game entrance/exit 
    * Determine if game is fun; if not, make it fun
    * Add some concept of score (fuel remaining? time taken?)
  * Optional
    * Thrust flame
    * Ship rotation (roll) when turning
    * ~~Powerups? Fuel pick-ups? ~~
    * ???
     
