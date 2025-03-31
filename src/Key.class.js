
export class Key {
    display;
    newTurn=true;
    dartcount=0;
    api;

    startPlayer=1;
    scoreStart=301;
 
    throws={
        1:[],
        2:[]
    }
    dbGame;

    constructor() {
        window.addEventListener("keydown",(e) => {this.keydown(e)});
        
        this.addNewInputField();    
        this.display=document.getElementsByName("display")[0];
        this.display.value="";
        this.adjustDelButton();
        this.setScore(this.scoreStart);
    }

    setDB(db) {
        this.dbGame=db;
    }

    keydown(event) {
        let numkeys=["Insert","End","ArrowDown","PageDown","ArrowLeft","Clear","ArrowRight","Pos1","ArrowUp","PageUp"];
        console.log(event.key,event.code);
        if (event.code.startsWith("Arrow")) {
            if (event.code == "ArrowUp") this.cursorUp();
            if (event.code == "ArrowDown") this.cursorDown();
       
            if (event.code == "ArrowLeft") this.cursorSwitch();
            if (event.code == "ArrowRight") this.cursorSwitch();
            return;
        }

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
            if (this.hasNoEntries) {

                if (this.display.value.trim() == "") {
                    this.startPlayer=this.startPlayer==1?2:1;
                    this.newTurn=!this.newTurn;
                    this.switchPlayer();
                    this.switchInputField();
                } else {
                    this.calculateNewValues();
                }

            }
        }

    }

    // let inputElement=document.getElementsByName("display")[0];
    // if (document.querySelectorAll("#history-player1>div:not(.header)")[3])

    get isInactiveArea() {
        return this.activePlayerId != this.cursorPosition;
    }
    get isActiveArea() {
        return this.activePlayerId == this.cursorPosition;
    }

    get hasNoEntries() {
        return (this.throws[1].length+this.throws[2].length) == 0;
    }

    get isLastElement() {
        return document.getElementById("history-player"+this.cursorPosition).lastElementChild.querySelector("input") != null;
    }

    get activePlayerId() {
        return document.getElementById("player1").classList.contains("active")?1:2; 
    }
    get inactivePlayerId() {
        return document.getElementById("player1").classList.contains("active")?2:1; 
    }

    get cursorPosition() {
        return document.getElementById("history-player1").querySelector("input") == null?2:1; 
    }

    get cursorRow() {
        let elements=Array.from(document.querySelectorAll(`#history-player${this.cursorPosition}>div:not(.header)`));
        let display=document.getElementsByName("display")[0].parentElement.parentElement;
        return elements.findIndex(e => e == display);
    }

    get cursorElement() {
        return document.getElementsByName("display")[0].parentElement.parentElement;
    }

    get scoreOfActivePlayer() {
        return document.getElementById("score"+this.activePlayerId).innerText;
    }

    get scoreCount() {
        let elements=document.querySelectorAll("#history-player"+this.cursorPosition+">div:not(.header)");
        if (elements[elements.length-1].lastElementChild.innerText.trim()=="") return elements.length-1;
        return elements.length;
    }

    get scoreOfCursorPosition() {
        return document.getElementById("score"+this.cursorPosition).innerText;
    } 

    /**
     * @param {string} score
     */
    set scoreOfCursorPosition(score) {
        document.getElementById("score"+this.cursorPosition).innerText=score;
    } 

    setScorePlayer1(score=this.score) {
        document.getElementById("score1").innerText=score;
    }

    setScorePlayer2(score=this.score) {
        document.getElementById("score2").innerText=score;
    }

    setScore(score=this.score) {
        this.score=score;
        this.setScorePlayer1();
        this.setScorePlayer2();
    }
 
    removeLastThrowFromArray() {
        this.throws[this.cursorPosition].pop();
    } 

    cursorMove(index,elementsLeft,direction=0) {
        console.log(elementsLeft[index]);
        let maxIndex=Math.max(elementsLeft.length-2,0);

        if (this.isInactiveArea && this.getLastScoreOfInactivePlayer() != "") {
            maxIndex=Math.max(elementsLeft.length-1,0);
        }

        if (this.isActiveArea) {
            maxIndex=Math.max(elementsLeft.length-1,0);
        }

        if (direction==0) {
            index--;
            if (index<0) {
                index=Math.max(maxIndex,0);
                // if (this.activePlayerId == this.cursorPosition) index=elementsLeft.length-1;
                // else index=Math.max(maxIndex,0);
            }     
        }

        if (direction==1) {
            index++;
            if (index>maxIndex) {
                index=0;
            }

        }

        this.switchInputFieldTo(elementsLeft[index]);
        console.log(elementsLeft[index]);
    }

    findCursor(elements,direction) {
        let display=document.getElementsByName("display")[0].parentElement.parentElement;
        let index=elements.findIndex(e => e == display);
        if (index>=0) {
            this.cursorMove(index,elements,direction)
        } 
        
    }

    cursorUp() {
        if (this.cursorRow == 0 && this.isLastElement) return;
        if (this.isInactiveArea && this.scoreCount <= 1) return;
        this.recalculateScore();

        let elementsLeft=Array.from(document.querySelectorAll("#history-player1>div:not(.header)"));
        let elementsRight=Array.from(document.querySelectorAll("#history-player2>div:not(.header)"));
        this.findCursor(elementsLeft,0);
        this.findCursor(elementsRight,0);

    }

    cursorDown() {
        if (this.cursorRow == 0 && this.isLastElement) return;
        if (this.isInactiveArea && this.scoreCount <= 1) return;
        this.recalculateScore();

        let elementsLeft=Array.from(document.querySelectorAll("#history-player1>div:not(.header)"));
        let elementsRight=Array.from(document.querySelectorAll("#history-player2>div:not(.header)"));
        
        this.findCursor(elementsLeft,1)
        this.findCursor(elementsRight,1)
    }

    getLastScoreOfInactivePlayer() {
        let elements=Array.from(document.querySelectorAll(`#history-player${this.inactivePlayerId}>div:not(.header)`));
        return elements[elements.length-1].firstElementChild.innerText.trim();
    }

    setLastScoreOfInactivePlayer(value) {
        let elements=Array.from(document.querySelectorAll(`#history-player${this.inactivePlayerId}>div:not(.header)`));
        return elements[elements.length-1].firstElementChild.innerText=value;
    }

    cursorSwitch() {
        console.log(this.cursorRow);
        let elements=Array.from(document.querySelectorAll(`#history-player${this.cursorPosition==1?2:1}>div:not(.header)`));
        if (this.activePlayerId == this.cursorPosition && 
            this.cursorRow == elements.length-1 &&
            elements[elements.length-1].firstElementChild.innerText.trim() == ""
        ) return;
        this.recalculateScore();

            // this.replaceChildren(elements[this.cursorRow]);
        // elements[this.cursorRow].firstElementChild=""
        // elements[this.cursorRow].replaceChildren(this.display);
        this.switchInputFieldTo(elements[this.cursorRow]);
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
        const score=parseInt(this.display.value+String(char));
        if (this.isLastElement) {
            console.log(score);
            if (score >180) return;
            if (score > this.scoreOfActivePlayer) return;
            if (score >170 && score == this.scoreOfActivePlayer) return;    
        }
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



    switchPlayer() {
        document.getElementById("player1").classList.toggle("active");
        document.getElementById("player2").classList.toggle("active");
        this.newTurn=!this.newTurn;
    }

    addScoreToList(score,thrown) {
        console.log(this.newTurn);
        if (this.newTurn) {
            let element=document.getElementById("history-player"+this.activePlayerId).lastElementChild;
            this.moveInputFieldTo(document.getElementById("history-player"+this.inactivePlayerId).lastElementChild);
            
            element.innerHTML=`
                <div>${thrown}</div>
                <div>${score}</div>            
            `;

            this.dartcount+=3;
            element=document.getElementById("history-darts");
            element.innerHTML+="<div><div>"+String(this.dartcount)+"</div></div>";

        } else {
            let player1=document.getElementById("history-player"+this.activePlayerId);
            let player2=document.getElementById("history-player"+this.inactivePlayerId);
            this.addEmptyHistory(player2);            
            
            let element=document.getElementById("history-player"+this.activePlayerId).lastElementChild;
            this.moveInputFieldTo(document.getElementById("history-player"+this.inactivePlayerId).lastElementChild);
 
            element.innerHTML=`
                <div>${thrown}</div>
                <div>${score}</div>            
            `;
            this.addEmptyHistory(player1);

        }
        return;

    }

    recalculateScore() {
        let score = this.scoreStart;
        let elements=Array.from(document.querySelectorAll(`#history-player${this.cursorPosition}>div:not(.header)`));
        for (let element of elements) {
            let scoreElement=element.firstElementChild;
            let sumElement=element.lastElementChild;
            let isDisplay=scoreElement.firstElementChild == this.display;

            if (sumElement.innerText.trim() == "") break;
            // if (scoreElement.innerText.trim()=="" && !isDisplay) return; 

            if (isDisplay) {
                score -= +this.display.value;    
            } else {
                score -= +scoreElement.innerText.trim();
            }

            sumElement.innerText=score;
        }
        this.scoreOfCursorPosition=score;
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
        if (this.isLastElement) {
            this.addScoreToList(score.innerText,this.display.value);
            this.display.value="";
            this.adjustDelButton();    
        } else {

        }
        return true;
    }

    calculateNewValues() {
        if (this.display.value == "") return;
        console.log("display isnt emty");
        if (!this.isLastElement) {
            alert("Not Last Element");
            // dbgame.updateGEthrow({
            //  playerNr: this.activePlayerId,
            //  throw: this.cursorRow,
            //  score: this.display.value,
            //  difference: this.throws[this.activePlayerId][this.cursorRow]-this.display.value
            // });
            this.throws[this.activePlayerId][this.cursorRow]=this.display.value;
            
            // TODO: SCHLEIFE RECALCULATE
            // this.recalculateNewValues();
            return
        }

        this.throws[this.activePlayerId].push(this.display.value);
        this.dbGame.insertThrow({
            legId: this.legId,
            playerNr: this.activePlayerId,
            round: this.cursorRow,
            score: this.display.value,
        });

            // if (dart.isAllowedThrow()) {
        if (this.calculatePlayerScore()) {
            this.switchPlayer();
        };
        // }
    }

    addEmptyHistory(element) {
        let html=`
            <div style="border:1px solid black">
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </div>
        `;
        element.innerHTML+=html;
    }

    addNewInputField() {
        let element=document.getElementById("history-player"+this.activePlayerId);
        let html=`
            <div>
                <div><input type="text" id="input" name="display" disabled  ></div>
                <div>&nbsp;</div>
            </div>
        `;
        element.innerHTML+=html;
        
        element=document.getElementById("history-player"+this.inactivePlayerId);
        this.addEmptyHistory(element);
    }

    // addNewInputField() {
    //     const input = document.createElement("input");
    //     input.id = "input";
    //     input.type = "text";

    //     let element=document.getElementById("history-player"+this.activePlayerId).lastElementChild;
    //     this.moveInputFieldTo(element)
    // }




    switchInputField() {
        let element=document.getElementById("history-player"+this.activePlayerId).lastElementChild;
        this.moveInputFieldTo(element)
    }

    moveInputFieldTo(targetElement) {        
        let target=targetElement.parentElement.lastElementChild.firstElementChild;
        let inputElement=document.getElementById("input");
        inputElement.value=target.innerText;
        target.replaceChildren(inputElement);    
        this.display.blur();        
    }

    switchInputFieldTo(targetElement) {        
        let target=targetElement.firstElementChild
        let inputElement=document.getElementById("input");

        let destinationParent=inputElement.parentElement;
        let destinationText=inputElement.value;

        inputElement.value=target.innerText;
        target.replaceChildren(inputElement);
        // this.display.value="HXXX"; // blur();        
        // this.display.blur();        
        destinationParent.innerText=destinationText;        
    }

    switchInputFieldNew(targetElement) {        
        let element=document.getElementById("history-player"+this.inactivePlayerId).lastElementChild;
        this.moveInputFieldTo(element)

        // let target=targetElement.lastElementChild.firstElementChild;
        // let inputElement=document.getElementById("input");
        // inputElement.value=target.innerText;
        // target.replaceChildren(inputElement);    
    }


    undoScoreInactive() {
        let playerInactive=document.getElementById("history-player"+this.inactivePlayerId);
        let scoreInactive=document.getElementById("score"+this.inactivePlayerId);
        scoreInactive.innerText=parseInt(scoreInactive.innerText)+parseInt(playerInactive.lastElementChild.firstElementChild.innerText);
    }

    removeLastInactiveEntry() {
        let element=document.getElementById("history-player"+this.inactivePlayerId);
        element.removeChild(element.lastElementChild);
    }
    removeLastActiveEntry() {
        let element=document.getElementById("history-player"+this.activePlayerId);
        element.removeChild(element.lastElementChild);
    }

    clearInputField() {
        this.display.value="";
    }

    clearLastScore() {
        let score=document.getElementById("history-player"+this.inactivePlayerId).lastElementChild.lastElementChild;
        score.innerText="";
    }

    clearLastDartcount() {
        let counter=document.getElementById("history-darts");
        counter.removeChild(counter.lastElementChild);
        this.dartcount-=3;
    }

    undo() {
        if (this.newTurn && this.dartcount==0) return;
        this.removeLastThrowFromArray();

        if (this.newTurn) {
            this.removeLastInactiveEntry();
            this.undoScoreInactive();
            this.switchInputFieldNew();
            this.clearLastScore();
            this.clearInputField();
            this.removeLastActiveEntry();
            this.switchPlayer();
        } else {
            this.undoScoreInactive();
            this.switchInputFieldNew();
            this.clearLastScore();
            this.clearInputField();
            this.switchPlayer();
            this.clearLastDartcount();

        }

    }


}