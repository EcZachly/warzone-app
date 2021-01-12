

export default class WarzoneMapper{
    static mapGamer(gamer){
        const dataObject = {
            username: gamer.username,
            platform: gamer.platform,
            needs_backfill: !!gamer.needs_backfill
        };
        return dataObject;
    }

    static mapMatch(match){
        const dataObject = {
            match_id: match.matchID,
            start_time: match.utcStartSeconds,
            end_time: match.utcEndSeconds,
            map: match.map,
            mode: match.mode,
            duration: match.duration,
            version: match.version,
            game_type: match.gameType,
            player_count: match.playerCount,
            team_count: match.teamCount
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

