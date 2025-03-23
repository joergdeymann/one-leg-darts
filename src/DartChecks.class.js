export class Dart {

    board=[];
    preferedCheckouts=["D16","D20","D8","D10","Bullseye"];
    alternativeCheckouts=["D4","D2","D5"];

    constructor() {
        this.buildBoard();

    }

    buildBoard() {
        for (let i=1;i<21;i++) {
            this.board.push([
                {
                    value:i,
                    text: String(i)
                }, 
                {
                    value:i*2,
                    text: "D"+String(i)
                }, 
                {
                    value:i*3,
                    text: "T"+String(i)
                } 
                
            ]);
        }

        this.board.push([
            {
                value:25,
                text: "Bull"
            }, 
            {
                value:50,
                text: "Bullseye"
            },
            {
                value:-1,
                text: "Error"
            }
        ]);
    }


    getPossibleDoubles(number) {
        return this.board.filter(e => e[1].value <= number);
    }

    getPossibleTripples(number) {
        return this.board.filter(e => e[2].value <= number);
    }

    getPossibleSingles(number) {
        return this.board.filter(e => e[0].value <= number);
    }


    getPossibleLastDouble(number) {
        return this.board.find(e => e[1].value == number);
    }

    getPossibleLastTripple(number) {
        return this.board.find(e => e[2].value == number);
    }

    getPossibleLastSingle(number) {
        return this.board.find(e => e[0].value == number);
    }


    getPossibleFilteredTripples(number) {
        return this.board.filter(e => {
            if (e[2].value <= number) {
                if (e[2].value > 20) return true; 
            }
            return false;   
        });
    }

    getPossibleFilteredDoubles(number) {
        return this.board.filter(e => {
            if (e[1].value <= number) {
                if (e[1].value > 20) return true; 
            }
            return false;   
        });
    }
    getPossibleLastFilteredDouble(number) {
        return this.board.find(e => {
            if (e[1].value == number) {
                if (e[1].value > 20) return true;
            }
        });
    }

    getPossibleLastFilteredTripple(number) {
        return this.board.find(e => {
            if (e[2].value == number) {
                if (e[2].value > 20) return true; 
            }
        });
    }




    getHighestDouble(number) {
        let halfnumber=Math.floor(number/2);
    }

    getShortesPossibleFinalThrows(number,darts=1) {
        let throws3=this.getPossibleFinalThrows(number);
        let throws2=throws3.filter(e => e.length<3);
        let throws1=throws2.filter(e => e.length<2);

        if (darts == 1) {
            if (throws1) return throws1;
            if (throws2) return throws2;    
            return throws3;
        } 

        if (darts == 2)  {
            if (throws2) return throws2;
            return throws3;
        }
        if (darts == 3)  {
            return throws3;
        }
    }



    getPossibleFinalThrows(number) {
        let throws=[];
        let dart1=0;
        let dart2=0;

        for (let double of this.getPossibleDoubles(number)) {
            dart1=double[1];
            let dart2value=number-double[1].value;
            
            if (dart2value == 0) {
                console.log("Null Rest nach dem ersten Dart!");
                throws.push([dart1]);
                continue;
            }


            //a) check tripple combinations for the 2nd dart
            for (let tripple of this.getPossibleFilteredTripples(dart2value)) {
                dart2=tripple[2];
                let dart3value = dart2value-tripple[2].value;
    
                this.getThirdDart(throws,dart1,dart2,dart3value);
            }

            //b) check double combinations for the 2nd dart
            for (let double of this.getPossibleFilteredDoubles(dart2value)) {
                dart2=double[1];
                let dart3value = dart2value-double[1].value;
                this.getThirdDart(throws,dart1,dart2,dart3value);                
            }

            //b) check single combinations for the 2nd dart
            for (let single of this.getPossibleSingles(dart2value)) {
                dart2=single[0];
                let dart3value = dart2value-single[0].value;
                this.getThirdDart(throws,dart1,dart2,dart3value);                
            }
            
        }
        return throws;
    }

    isTooSmall(dart1,dart2,dart3) {
        if (this.isSinglesTooSmall(dart1,dart2,dart3)) return true;
        if (this.isDoublesTooSmall(dart1,dart2,dart3)) return true;
        if (this.isTripplesTooSmall(dart1,dart2,dart3)) return true;
        return false;
    }


    isSinglesTooSmall(dart1,dart2,dart3) {
        // if (!isNaN(dart1.text) &&  !isNaN(dart2.text) && (dart1.value+dart2.value) <21) return true;
        // if (!isNaN(dart1.text) &&  !isNaN(dart3.text) && (dart1.value+dart3.value) <21) return true;
        // if (!isNaN(dart2.text) &&  !isNaN(dart3.text) && (dart2.value+dart3.value) <21) return true;

        try {
            if ((dart1.value+dart2.value) <21) return true;
            if ((dart1.value+dart3.value) <21) return true;
            if ((dart3.value+dart2.value) <21) return true;
        } catch (e) {
        }
        return false;
    }

    /**
     * Compare if 2 Darts are in Double
     * if one Double has value less 21
     * do not track
     * 
     * @param {JSON} dart1 
     * @param {JSOAN} dart2 
     * @returns 
     */
    isDoubleTooSmallCompare(dart1,dart2) {
        if (dart1.text[0] != "D" || dart2.text[0] != "D") return false;
        if ((dart1.value/2+dart2.value/2) <21) return true;
        if ((dart1.value) < 21) return true;
        if ((dart2.value) < 21) return true;         
        return false;
    }

    isDoublesTooSmall(dart1,dart2,dart3) {
        if (this.isDoubleTooSmallCompare(dart1,dart2)) return true;
        if (this.isDoubleTooSmallCompare(dart1,dart3)) return true;
        if (this.isDoubleTooSmallCompare(dart3,dart2)) return true;

        if (dart1.text[0]=="D" && dart2.text[0]=="D" &&  dart3.text[0]=="D" && (dart1.value/2+dart2.value/2+dart3.value/2) <21) return true;
        
        return false;
    }

    isTripplesTooSmall(dart1,dart2,dart3) {
        if (dart1.text[0]=="T" && dart2.text[0]=="T" && (dart1.value/3+dart2.value/3) <21) return true;
        if (dart1.text[0]=="T" && dart3.text[0]=="T" && (dart1.value/3+dart3.value/3) <21) return true;
        if (dart2.text[0]=="T" && dart3.text[0]=="T" && (dart2.value/3+dart3.value/3) <21) return true;
        if (dart1.text[0]=="T" && dart2.text[0]=="T" &&  dart3.text[0]=="T" && (dart1.value/3+dart2.value/3+dart3.value/3) <21) return true;
        return false;
    }

    addThrow(throws,dart1,dart2,dart3) {
        if (this.isTooSmall(dart1,dart2,dart3)) return;

        let newThrow=[dart1.text,dart2?.text||"",dart3?.text||""].sort().join(",");
        for (let t of throws) {
            let checkThrow=[t[0].text,t[1]?.text||"",t[2]?.text||""].sort().join(",");
            if (newThrow == checkThrow) return;
        }
        throws.push([dart1,dart2,dart3]);
    }

    getThrowAsText(thrown) {
        if (thrown.length == 3) return [thrown[0].text,thrown[1].text,thrown[2].text].join(" ");
        if (thrown.length == 2) return [thrown[0].text,thrown[1].text].join(" ");
        if (thrown.length == 1) return thrown[0].text;
        return "0";        
    }

    getThrowsAsText(throws) {
        // console.log("getThrowsAsText");
        // console.log(throws);
        let newThrows=[];
        for (let t of throws) {
            newThrows.push(this.getThrowAsText(t));
        }
        return newThrows;        
    }

    getThirdDart(throws,dart1,dart2,rest) {
        let dart3;

        if (rest == 0) {
            console.log("Null Rest nach dem zweiten Dart!");
            if (!this.isDoubleTooSmallCompare(dart1,dart2)) throws.push([dart1,dart2]);
            return;
        }

        // a.1) check Tripple for the 3rd dart 
        dart3=this.getPossibleLastFilteredTripple(rest);
        if(dart3) this.addThrow(throws,dart1,dart2,dart3[2]);

        
        // if (dart3 && !this.isTooSmall(dart1,dart2,dart3[2])) throws.push([dart1,dart2,dart3[2]]);

        // a.2) check Double for the 3rd dart 
        dart3=this.getPossibleLastFilteredDouble(rest);
        if(dart3) this.addThrow(throws,dart1,dart2,dart3[1]);
        // if (dart3 && !this.isTooSmall(dart1,dart2,dart3[1])) throws.push([dart1,dart2,dart3[1]]);
        
        // a.3) check Double for the 3rd dart 
        dart3=this.getPossibleLastSingle(rest);
        if(dart3) this.addThrow(throws,dart1,dart2,dart3[0]);
        // if (dart3 && !this.isTooSmall(dart1,dart2,dart3[0])) throws.push([dart1,dart2,dart3[0]]);
    }

    getPreferedCheckouts(throws) {
        const preferedCheckouts=this.preferedCheckouts;
        const alternativeCheckouts=this.alternativeCheckouts;

        let list=throws.filter(e => 
            preferedCheckouts.includes(e[0].text) || 
            preferedCheckouts.includes(e[1].text) ||
            preferedCheckouts.includes(e[2]?.text) 
        );
        if (list) return list;
        
        list=throws.filter(e => 
            alternativeCheckouts.includes(e[0].text) || 
            alternativeCheckouts.includes(e[1].text) ||
            alternativeCheckouts.includes(e[2]?.text) 
        );
        if (list) return list;

        return throws;
    }
    
    getSortedCheckouts(throws) {
        const preferredCheckouts = this.preferedCheckouts;

        return throws.slice().sort((rowA, rowB) => {
            const wordsA = rowA.split(" ");
            const wordsB = rowB.split(" ");
    
            // **1. Sortieren nach Anzahl der Werte (weniger ist besser)**
            if (wordsA.length !== wordsB.length) {
                return wordsA.length - wordsB.length;
            }
    
            // **2. Falls gleiche Anzahl, nach bevorzugtem Checkout sortieren**
            const priorityA = Math.min(...wordsA.map(word => {
                const index = preferredCheckouts.indexOf(word);
                return index === -1 ? preferredCheckouts.length : index;
            }));
    
            const priorityB = Math.min(...wordsB.map(word => {
                const index = preferredCheckouts.indexOf(word);
                return index === -1 ? preferredCheckouts.length : index;
            }));
    
            return priorityA - priorityB;
        });
    }
    
    getBestCheckouts(throws) {
        const oneValue = new Set();
        const twoValues = new Set();
        const threeValues = new Set();
    
        const result = {
            one: null,
            two: null,
            three: null
        };
    
        for (const throwSet of throws) {
            const values = throwSet.split(" "); // Split in einzelne Werte
    
            if (values.length === 1 && !oneValue.has(throwSet)) {
                oneValue.add(throwSet);
                if (result.one === null) result.one = throwSet;
            }
    
            if (values.length === 2 && !twoValues.has(throwSet)) {
                twoValues.add(throwSet);
                if (result.two === null) result.two = throwSet;
            }
    
            if (values.length === 3 && !threeValues.has(throwSet)) {
                threeValues.add(throwSet);
                if (result.three === null) result.three = throwSet;
            }
    
            // Falls alle gefunden wurden, können wir abbrechen
            if (result.one && result.two && result.three) break;
        }
    
        return result;
    }
        
}

function Xinit() {
    dart=new Dart();
    // console.log(dart.getPossibleDoubles(50));
    // console.log(dart.getPossibleFinalThrows(50));
    // console.log(dart.getPossibleLastDouble(20));
    let throws=dart.getShortesPossibleFinalThrows(84,2);   
    throws=dart.getPreferedCheckouts(throws);

    // console.log(dart.getShortesPossibleFinalThrows(50));
    // console.log(dart.getShortesPossibleFinalThrows(50,2));
    console.log(throws);
    throws=dart.getThrowsAsText(throws);
    console.log(throws);
    throws=dart.getSortedCheckouts(throws);
    console.log(throws);
    throws=dart.getBestCheckouts(throws);
    console.log(throws);    

    scrollHistoryToBottom();
}

function scrollHistoryToBottom() {
    document.querySelectorAll('.history-player').forEach(player => {
        player.scrollTop = player.scrollHeight;
    });
}

// Rufe die Funktion auf, wenn neue Inhalte hinzugefügt werden
function addHistoryEntry(playerId, score, total) {
    const playerHistory = document.getElementById(playerId);
    
    const newEntry = document.createElement("div");
    newEntry.classList.add("history-score");
    newEntry.innerHTML = `<div>${score}</div><div>${total}</div>`;
    
    playerHistory.appendChild(newEntry);
    scrollHistoryToBottom(); // Automatisch zum neuesten Eintrag scrollen
}

// Rufe diese Funktion nach jeder Aktualisierung der History auf
// window.onload = scrollHistoryToBottom;