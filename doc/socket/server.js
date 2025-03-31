// instealliere erst ws
// npm install ws
wsServer();
function wsServer() {
    const WebSocket = require("ws");
    const port=8080;
    
    const wss = new WebSocket.Server({ port: port });
    
    wss.on("connection", (ws) => {
        console.log("Ein neuer Client ist verbunden!");
    
        // Nachricht vom Client empfangen
        ws.on("message", (message) => {
            console.log("Nachricht vom Client:", message.toString());
    
            // Antwort an den Client senden
            ws.send("Nachricht erhalten: " + message);
        });
    
        // Begrüßungsnachricht an den Client senden
        ws.send("Willkommen! Du bist verbunden.");
    });
    
    console.log("WebSocket-Server läuft auf ws://localhost:"+port);    
}
