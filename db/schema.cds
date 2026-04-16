namespace my.dokkanproject;

entity Character {
    key ID          : Integer;
    title           : String;  
    name            : String;   
    rarity          : String;   
    type            : String;   
    classType       : String;  
    cost            : Integer;
    thumbnail       : String;   
    artwork         : String;   
    hp              : Integer;
    atk             : Integer;
    def             : Integer;
    leaderSkill     : String;
    superAttackName : String;
    superAttack     : String;
    ultraSAName     : String;
    ultraSA         : String;
    passiveName     : String;
    passive         : String;
    linkSkills      : String;  
    categories      : String;  
    releaseDate     : String;
    isUpcoming      : Boolean default false;
}

entity Category {
    key ID   : Integer;
    name     : String;
}