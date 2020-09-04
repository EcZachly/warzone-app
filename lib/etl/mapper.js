

export default class WarzoneMapper{
    static mapGamer(gamer){
        let dataObject = {
            username: gamer.username,
            platform: gamer.platform
        }
        return dataObject;
    }

    static mapMatch(match){
        let dataObject = {
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
        }
        return dataObject;
    }
    static mapGamerMatch(match, queryGamer){
        let dataObject = {
            query_username: queryGamer.username,
            query_platform: queryGamer.platform,
            username: match.player.username,
            match_id: match.matchID,
            team: match.player.team,
            clan_tag: match.player.clantag,
            kills: match.playerStats.kills,
            assists: match.playerStats.assists,
            deaths: match.playerStats.deaths,
            score: match.playerStats.score,
            damage_done: match.playerStats.damageDone,
            damage_taken: match.playerStats.damageTaken,
            team_placement: match.playerStats.teamPlacement,
            longest_streak: match.playerStats.longestStreak,
            time_played: match.playerStats.timePlayed,
            distance_traveled: match.playerStats.distanceTraveled,
            team_survival_time: match.playerStats.teamSurvivalTime,
            percent_time_moving: match.playerStats.percentTimeMoving,
            wall_bangs: match.playerStats.wallBangs,
            gulag_deaths: match.playerStats.gulagDeaths,
            gulag_kills:match.playerStats.gulagKills,
            headshots: match.playerStats.headshots,
            executions: match.playerStats.executions,
            objective: JSON.stringify({
                down_enemy_circle_2: match.playerStats.objectiveBrDownEnemyCircle2,
                down_enemy_circle_1: match.playerStats.objectiveBrDownEnemyCircle1,
                missions_started: match.playerStats.objectiveBrMissionPickupTablet,
                caches_open: match.playerStats.objectiveBrCacheOpen,
                teams_wiped: match.playerStats.objectiveTeamWiped
            }),
            xp: JSON.stringify({
                medal_xp: match.playerStats.medalXp,
                score_xp: match.playerStats.scoreXp,
                match_xp: match.playerStats.matchXp,
                total_xp: match.playerStats.totalXp,
                challenge_xp: match.playerStats.challengeXp,
                misc_xp: match.playerStats.miscXp,
                bonus_xp: match.playerStats.bonusXp
            }),
            loadout: JSON.stringify(match.player.loadout)
        }
        return dataObject;
    }
}

