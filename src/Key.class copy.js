export class Key {
    display;
    newTurn=true;
    dartcount=0;
    api;

    constructor() {
        window.addEventListener("keydown",(e) => {this.keydown(e)});
        
        this.display=document.getElementsByName("display")[0];
        this.display.value="";
        this.adjustDelButton();
    }

    keydown(event) {
        let numkeys=["Insert","End","ArrowDown","PageDown","ArrowLeft","Clear","ArrowRight","Pos1","ArrowUp","PageUp"];
        console.log(event.key);
        if (!isNaN(event.key)) {
            this.addNumberToField(event.key);
        }

        if (numkeys.includes(event.key)) {
            this.addNumberToField(numkeys.indexOf(event.key));
        }

        if (event.key == "Backspace") {
            this.removeLastNumberFromField();
        }
        if (event.key == "Enter") {
            this.calculateNewValues();
        }

        if (event.key == "Tab") {
            this.switchPlayer();
        }

    }

    adjustDelButton() {
        if (this.display.value=="") {
            document.getElementById("del").innerHTML="Undo";
            document.getElementById("accept").innerHTML="Menu";
        } else {
            document.getElementById("del").innerHTML="Del";
            document.getElementById("accept").innerHTML="Accept";
        }
    }

    addNumberToField(char) {
        if (this.display.value.length>2) return;
        this.display.value+=String(char);
        this.adjustDelButton();
    }

    removeLastNumberFromField() {
        if (this.display.value.length<1) {
            this.undo();
            return;
        }
        this.display.value=this.display.value.slice(0,-1);
        this.adjustDelButton();
    }

    get activePlayerId() {
        return document.getElementById("player1").classList.contains("active")?1:2; 
    }
    get inactivePlayerId() {
        return document.getElementById("player1").classList.contains("active")?2:1; 
    }

    switchPlayer() {
        document.getElementById("player1").classList.toggle("active");
        document.getElementById("player2").classList.toggle("active");
        this.newTurn=!this.newTurn;
    }

    addScoreToList(score,thrown) {
        if (!this.newTurn) {
            let element=document.getElementById("history-player"+this.activePlayerId);
            element.lastElementChild.remove();
        }
        

        let html=`
            <div>
                <div>${thrown}</div>
                <div>${score}</div>
            </div>
        `;

        let element=document.getElementById("history-player"+this.activePlayerId);
        element.innerHTML+=html;

        if (this.newTurn) {
            this.dartcount+=3;
            element=document.getElementById("history-darts");
            element.innerHTML+="<div><div>"+String(this.dartcount)+"</div></div>";


            element=document.getElementById("history-player"+this.inactivePlayerId);
            this.addEmptyHistory(element);

        }
        // this.newTurn=!this.newTurn;
    }

    calculatePlayerScore() {
        let score=document.getElementById("score"+this.activePlayerId);
        let oldScore=+score.innerText;
        let thrown=+this.display.value;
        if (oldScore  < thrown) return false;
        if ((oldScore - thrown) == 1) return false; // Double out don't alow Rest of 1
        if (oldScore == thrown && !this.api.isFinishPossible(thrown)) return false;
        if (oldScore != thrown && !this.api.isThrowPossible(thrown)) return false;

     
        score.innerText-= this.display.value;
        this.addScoreToList(score.innerText,this.display.value);
        this.display.value="";
        this.adjustDelButton();
        return true;
    }

    calculateNewValues() {
        if (this.display.value == "") return;
        console.log("display isnt emty");
        // if (dart.isAllowedThrow()) {
            if (this.calculatePlayerScore()) {
                this.switchPlayer();
            };
        // }
    }
    
    addEmptyHistory(element) {
        let html=`
            <div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </div>
        `;
        element.innerHTML+=html;
    }

    undo() {
        if (this.newTurn && this.dartcount==0) return;

        //let scoreActive=document.getElementById("score"+this.activePlayerId);
        let scoreInactive=document.getElementById("score"+this.inactivePlayerId);

        let playerActive=document.getElementById("history-player"+this.activePlayerId);
        let playerInactive=document.getElementById("history-player"+this.inactivePlayerId);
        let counter=document.getElementById("history-darts");
        scoreInactive.innerText=parseInt(scoreInactive.innerText)+parseInt(playerInactive.lastElementChild.firstElementChild.innerText);
        if (this.newTurn) {
            // scoreInactive.innerText=parseInt(scoreInactive.innerText)+parseInt(playerInactive.lastElementChild.firstElementChild.innerText);
            playerInactive.lastElementChild.remove();
            this.addEmptyHistory(playerInactive);
            this.switchPlayer();
            return;
        } else {
            // scoreActive.innerText=parseInt(scoreActive.innerText)+parseInt(playerActive.lastElementChild.firstElementChild.innerText);
            playerInactive.lastElementChild.remove();
            playerActive.lastElementChild.remove();
            counter.lastElementChild.remove();
            this.dartcount-=3;
            this.switchPlayer();
            return;
        }

    }


}