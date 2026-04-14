namespace my.dokkanproject;

entity Character {
    key ID: Integer;
    name: String;
    type: String;
    hp: Integer;
    atk: Integer;
    def: Integer;
    passive: String;
}

entity Category {
    key ID: Integer;
    name: String;
    characters: Association to many Character on characters.ID = $self.ID;
}