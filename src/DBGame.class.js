class DBGame {
    db;
    legId=0;


    constructor(db) {
        this.db=db;
    }

    async getNextLegId() {
        let data=await this.db.query(
            "SELECT MAX(legId) as legId FROM DART_throw"
        );
        return data[0].legId;
    }

    async insertScore(json) {
        if (json.legId == 0 ) {
            // finde heraus ob das Spiel noch läuft noch einen abbruch 
            // Speichern eines Spiels am Start mit der GameId (running games)
            // und löschen nach dem das Spiel beendet wurde
            // ist das Spiel nicht in der Running List, ist es ein neues Spiel

            json.legId=await this.getNextLegId();
            // Es muss noch das Game angelegt werden (mit der ID des Plans falls vorhanden)
        }

        let result=await this.db.query(`
            INSERT INTO DART_throw 
                (legId, playerNr, round, score) 
            VALUES 
                (json.legId,json.playerNr,json.round,json.score)

        `);
        return result.insertId;


    }


}