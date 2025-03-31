<?php
class Query {
    private $request="";
    private $pdo;

    public function __construct() {
        $this->getRequest();
        $this->connect();
    }

    public function getRequest() {
        header('Content-Type: application/json');
        try {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(["error" => "Ungültiges JSON-Format"]);
                exit;
            }
            $this->request=$data["query"];
        
        } catch (Exception $e) {
            $this->error("PHP Request einlesen fehlgeschlagen: ",$e);
            exit;
        }  
    
    }


    private function connect() {
        $dbname = "bu"; 
        $user = "php";
        $pw = "#php#8.0-..";
        $host = "localhost";
        
        if ($_SERVER['SERVER_NAME'] == 'dd-office.de') {
            $user = "k149450_ddbuero";
            $dbname = "k149450_ddbuero"; 
            $pw = "diE1.dEy9@jd#73";
            $host = "10.35.233.28:3306";
        }
        
        try {
            // Verbindung zur Datenbank herstellen
            $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Fehler als Exceptions werfen
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Ergebnisse als assoziative Arrays zurückgeben
                PDO::ATTR_EMULATE_PREPARES => false, // Native Prepared Statements nutzen
                PDO::MYSQL_ATTR_MULTI_STATEMENTS => true // Erlaubt mehrere Abfragen
            ];
            $this->pdo = new PDO($dsn, $user, $pw, $options);        
        } catch (PDOException $e) {
            $this->error("Verbindungsfehler zur Datenbank:",$e);
            exit;
        } catch (Exception $f) {
            $this->error("Allgemeiner Fehler:",$f);
            exit;
        } 
    
    }

    private function error($usertext="nicht angegeben",$e) {
        $requesttext=$this->request??"Unbekannt";
        error_log($usertext);
        error_log("Request" .  $requesttext);
        error_log("Message: ". $e->getMessage());
        error_log("Datei: " . $e->getFile());
        error_log("Zeile: " . $e->getLine());

        echo json_encode([
            "error" => $usertext,
            "message" => $e->getMessage(),
            "request" => $requesttext,
            "line" =>  $e->getLine(),
            "file" =>  $e->getFile()
        ]);

    }

}

?>

