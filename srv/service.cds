using my.dokkanproject as my from '../db/schema';

service CharacterInfo {
    entity Characters as projection on my.Character;
}