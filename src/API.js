export class API {
    checkoutlist;
    constructor(type="") {
        if (type=="checklist") this.loadCheckouts(); 
    }

    async loadData(file) {
        try {
            const response = await fetch(file);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fehler beim Laden der API:", error);
        }
    }

    async loadCheckouts() {
        this.checkoutlist=await this.loadData("./API/finishes.json");
    }

    isFinishPossible(number) {
        return this.checkoutlist.find(e => e.number==number) != -1;
    } 

    isThrowPossible(number) {
        return number<=180;
    }   

    // isValidScore(number) {
    //     if (this.isFinishPossible(number)) {
    //         return true;
    //     }
    //     return "";

    // }

    getDarts(number) {
        if (this.isFinishPossible()) {
            return this.checkoutlist.find(e => e.number==number).throws;
        }
        return "";
    } 

}
