/**
 * usage:
 *     let d=new Database();
 *     let result=await d.query("select * from bu_address");
 *     console.log(result);

 */
export class Database {
    #filename={ // Root is the Directory of the HTML file
        select:"./php/select.php",
        update:"./php/update.php",
        insert:"./php/insert.php"
    }

    constructor() {
    }

    async query(query,filename="select") {
        if (query.toLowerCase().startsWith("select")) {
            filename="select";
        } else {
            filename="insert";
        }

        return fetch(this.#filename[filename], {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({query:query})
        })
        .then(response => response.json())
        .then(data => {
            return data; // Rückgabe vom PHP-Skript anzeigen
        })
        .catch(error => {
            // ###Fehlerbehandlung für JS SCRIPT !!
            console.log("Request:\n"+query);
            console.log(data.error);
            console.error('Fehler:', error);
            // throw error;
        });
    }
}
