<?php
require_once "Query.php"; 

class Select extends Query {
    public function __construct() {
        parent::__construct();
        $this->query();
    }

    private function query() {
        try {
            $stmt = $this->pdo->query($this->request);
            $rows = $stmt->fetchAll();
        } catch (PDOException $e) {
            $this->error("Datenbankabfrage-Fehler: ",$e);
            exit;
        }    
        echo json_encode(["data" => $rows]);
        exit;    
    }
}
new Select();

?>

