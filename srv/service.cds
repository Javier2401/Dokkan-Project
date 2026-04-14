using my.dokkanproject as my from '../db/schema';

service CharacterInfo {
    entity Characters as projection on my.Character;
    entity Categories as projection on my.Category;
    
    action getTopCharacters(type: String) returns array of Characters;
}