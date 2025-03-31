<?php
require_once "Query.php"; 

class Insert extends Query {
    public function __construct() {
        parent::__construct();
        $this->query();
    }

    private function query() {
        try {
            $rows = $this->pdo->exec($this->request);
        } catch (PDOException $e) {
            $this->error("Datenbankabfrage-Fehler: ",$e);
            exit;
        }
    
        echo json_encode([
            "affectedRows" => $rows,
            "insertId" => $this->pdo->lastInsertId()
        ]);
        exit;    
    }
}
// $stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
// $stmt->execute(["Max Mustermann", "max@example.com"]);
new Insert();

?>

