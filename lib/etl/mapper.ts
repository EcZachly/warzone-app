import {GAME_CATEGORIES} from "../constants";


export default class WarzoneMapper{
    static mapGamer(gamer){
        const dataObject = {
            username: gamer.username,
            platform: gamer.platform,
            needs_backfill: !!gamer.needs_backfill
        };
        return dataObject;
    }

    static getMatchTeamType(match){
        let team_type = null;
        let {mode, team_count} = match;
        let config = ['solo', 'duo', 'trio', 'quad'];
        config.forEach((val)=>{
            if(mode.includes(val)){
                team_type = val;
            }
        })

        if(!team_type){
            if(team_count > 100){
                team_type = 'solo'
            }
            else if(team_type > 60){
                team_type = 'duo'
            }
            else if(team_type > 45){
                team_type = 'trio'
            }
            else if(team_type <= 45 && team_type >= 30){
                team_type = 'quad'
            }
        }
        return team_type;
    }

    static getMatchCategory(match){
        let config = {
            [GAME_CATEGORIES.PLUNDER]: ['plnd', 'plun', 'pln', 'bldmny'],
            [GAME_CATEGORIES.JUGGERNAUT_ROYALE]: ['jugg'],
            [GAME_CATEGORIES.WARZONE_RUMBLE]: ['rmbl'],
            [GAME_CATEGORIES.REBIRTH_MINI_ROYALE]: ['rebirth_mini_royale'],
            [GAME_CATEGORIES.MINI_ROYALE]: ['mini'],
            [GAME_CATEGORIES.KING_SLAYER]: ['kingslayer'],
            [GAME_CATEGORIES.STIMULUS]: ['stim', 'brbb'],
            [GAME_CATEGORIES.RESURGENCE]: ['rebirth', 'rbrth'],
            [GAME_CATEGORIES.TRUCK_WAR]: ['truckwar'],
            [GAME_CATEGORIES.ZOMBIE_ROYALE]: ['zmbroy'],
            [GAME_CATEGORIES.DMZ]: ['dmz']
        }

        let category = GAME_CATEGORIES.WARZONE;
        let differentCategoryFound = false;

        Object.keys(config).forEach((key)=>{
            let values = config[key];
            values.forEach((val)=>{
                if(match.mode.includes(val) && !differentCategoryFound){
                    category = key;
                    differentCategoryFound = true;
                }
            })
        })

        return category;
    }

    static mapMatch(match){
        const dataObject = {
            match_id: match.matchID,
            start_time: match.utcStartSeconds,
            end_time: match.utcEndSeconds,
            start_timestamp: new Date(match.utcStartSeconds*1000),
            end_timestamp: new Date(match.utcEndSeconds*1000),
            map: match.map,
            mode: match.mode,
            duration: match.duration,
            version: match.version,
            game_type: match.gameType,
            player_count: match.playerCount,
            team_count: match.teamCount,
            game_category: WarzoneMapper.getMatchCategory(match),
            team_type: WarzoneMapper.getMatchTeamType(match)
        };
        return dataObject;
    }
    static mapGamerMatch(match, queryGamer){
        let {playerStats, player} = match;
        let missionsByType = player.brMissionStats?.missionStatsByType;
        let queryUsername = queryGamer.username === '-' ? player.uno : queryGamer.username;
        let queryPlatform = queryGamer.platform === '-' ? 'uno' : queryGamer.username;
        const dataObject = {
            query_username: queryUsername,
            query_platform: queryPlatform,
            username: player.username,
            match_id: match.matchID,
            team: player.team,
            uno_id: player.uno,
            clan_tag: player.clantag,
            kills: playerStats.kills,
            assists: playerStats.assists,
            deaths: playerStats.deaths,
            score: playerStats.score,
            damage_done: playerStats.damageDone,
            damage_taken: playerStats.damageTaken,
            team_placement: playerStats.teamPlacement,
            longest_streak: playerStats.longestStreak,
            time_played: playerStats.timePlayed,
            distance_traveled: playerStats.distanceTraveled,
            team_survival_time: playerStats.teamSurvivalTime,
            percent_time_moving: playerStats.percentTimeMoving,
            wall_bangs: playerStats.wallBangs,
            gulag_deaths: playerStats.gulagDeaths,
            gulag_kills:playerStats.gulagKills,
            headshots: playerStats.headshots,
            executions: playerStats.executions,
            objective: JSON.stringify({
                buys: playerStats.objectiveBrKioskBuy,
                munitions_boxes: playerStats.objectiveMunitionsBoxTeammateUsed,
                equipment_destroyed: playerStats.objectiveDestroyedEquipment,
                light_vehicle_destroyed: playerStats.objectiveDestroyedVehicleLight,
                medium_vehicle_destroyed: playerStats.objectiveDestroyedVehicleMedium,
                heavy_vehicle_destroyed: playerStats.objectiveDestroyedVehicleHeavy,
                revives: playerStats.objectiveReviver,
                down_enemy_circle_7: playerStats.objectiveBrDownEnemyCircle7,
                down_enemy_circle_6: playerStats.objectiveBrDownEnemyCircle6,
                down_enemy_circle_5: playerStats.objectiveBrDownEnemyCircle5,
                down_enemy_circle_4: playerStats.objectiveBrDownEnemyCircle4,
                down_enemy_circle_3: playerStats.objectiveBrDownEnemyCircle3,
                down_enemy_circle_2: playerStats.objectiveBrDownEnemyCircle2,
                down_enemy_circle_1: playerStats.objectiveBrDownEnemyCircle1,
                missions_started: playerStats.objectiveBrMissionPickupTablet,
                missions_completed: player?.brMissionStats?.missionsComplete,
                caches_open: playerStats?.objectiveBrCacheOpen,
                teams_wiped: playerStats?.objectiveTeamWiped
            }),
            xp: JSON.stringify({
                medal_xp: playerStats.medalXp,
                score_xp: playerStats.scoreXp,
                match_xp: playerStats.matchXp,
                total_xp: playerStats.totalXp,
                challenge_xp: playerStats.challengeXp,
                misc_xp: playerStats.miscXp,
                bonus_xp: playerStats.bonusXp
            }),
            loadout: JSON.stringify(player.loadout),
            contracts: JSON.stringify({
                bounty:  missionsByType?.assassination?.count,
                recon: missionsByType?.domination?.count,
                scavenger: missionsByType?.scavenger?.count,
                most_wanted:  missionsByType?.vip?.count,
                supply_run:  missionsByType?.timedrun?.count,
            }),
            raw_data: JSON.stringify(match)
        };
        return dataObject;
    }
}

