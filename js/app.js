const grid = document.querySelector('.grid');
const doodler = document .createElement('div');
let isGameOver = false ;
let platforms = []; 
let upTimerId ;
let downTimerId ;
let isJumping = true ;
let isGoingLeft = false
let isGoingRight = false
let leftTimerId
let rightTimerId
let score = -1

document.addEventListener('DOMContentLoaded', () =>{
    
    let doodlerLeftSpace = 50 ;
    let startPoint = 150
    let doodlerBottomSpace = startPoint ;
    let platformcount = 5 ;

   const createDooler = () => {
        grid.appendChild(doodler) ;
        doodler.classList.add('doodler') ;
        doodlerLeftSpace = platforms[0].left ; 
        doodler.style.left = doodlerLeftSpace + 'px' ; 
        doodler.style.bottom = doodlerBottomSpace + 'px' ;
    }
    
    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom ;
            this.left = Math.random() * 315 ;
            this.visual = document.createElement('div') ;

            const visual = this.visual
            visual.classList.add('platform') ;
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    const createPlatform = () =>{
        for ( let i = 0; i < platformcount; i++){
            let platGap = 600 / platformcount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom) 
            platforms.push(newPlatform)
            console.log(platforms)
        }

    }

    const movePlatforms = () => {
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual 
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)

                }
            })
        }
    }

    const jump = () => {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(()=>{
            doodlerBottomSpace += 20 
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        },30)
    }

    const fall = () => {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval ( ()=>{
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0 ) {
                GameOver()
            }

            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            },30)

        },30)
    }

    function GameOver () {
        console.log('gameOver')
        isGameOver = true 
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score

        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }



    const control  = (e) => {
        if(e.key === "ArrowLeft"){
            // move left
            moveLeft()
        }else if(e.key === "ArrowRight"){
            // move Right
            moveRight()
        }else if(e.key === "ArrowUp"){
            // move Straight
            moveStraight()
        }
    }

    const moveLeft = () => {
        if (isGoingRight) {
            clearInterval (rightTimerId)
            isGoingRight = false
        }

        isGoingLeft = true
        leftTimerId = setInterval(()=>{
            if (doodlerLeftSpace >= 0){
            doodlerLeftSpace -= 5
            doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        },30)
    }

    const moveRight = () => {
        if (isGoingLeft) {
            clearInterval (leftTimerId)
            isGoingLeft = false
        }

        isGoingRight = true
        leftTimerId = setInterval(()=>{
            if (doodlerLeftSpace <= 340){
            doodlerLeftSpace += 5
            doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        },30)
    }

    const moveStraight = () => {
        isGoingRight = false
        isGoingLeft =false
        clearInterval (rightTimerId)
        clearInterval (leftTimerId)
    }

    const start = () => {
        if(!isGameOver){
            createPlatform()
            createDooler()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup' , control)
        }
    }
    //attach to button
    start()

        
    // button right and left

    const rightBtn = document.getElementById("right");
    const leftBtn = document.getElementById("left");

    rightBtn.addEventListener("click", moveLeft);
    leftBtn.addEventListener("click",moveRight);

})
