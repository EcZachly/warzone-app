select uno_id,
       count(*)                                                                    as total_matches,

       count(CASE WHEN team_type = 'solo' then 1 END)                              as total_solo_matches,

       count(CASE WHEN team_type = 'duo' then 1 END)                               as total_duo_matches,

       count(CASE WHEN team_type = 'trio' then 1 END)                              as total_trio_matches,

       count(CASE WHEN team_type = 'quad' then 1 END)                              as total_quad_matches,

       (avg(team_placement) / avg(team_count))::real                               as average_overall_placement_percentage,

       (avg(CASE when team_type = 'solo' then team_placement END) /
            avg(CASE when team_type = 'solo' then team_count END))::real               as average_solo_placement_percentage,

       (avg(CASE when team_type = 'duo' then team_placement END) /
        avg(CASE when team_type = 'duo' then team_count END))::real                as average_duo_placement_percentage,

       (avg(CASE when team_type = 'trio' then team_placement END) /
        avg(CASE when team_type = 'trio' then team_count END))::real               as average_trio_placement_percentage,

       (avg(CASE when team_type = 'quad' then team_placement END) /
        avg(CASE when team_type = 'quad' then team_count END))::real               as average_quad_placement_percentage,

       (avg(CASE WHEN team_type = 'solo' then score END))::integer                 as average_solo_score,

       (avg(CASE WHEN team_type = 'duo' then score END))::integer                  as average_duo_score,

       (avg(CASE WHEN team_type = 'trio' then score END))::integer                 as average_trio_score,

       (avg(CASE WHEN team_type = 'quad' then score END))::integer                 as average_quad_score,

       (avg(CASE when team_type = 'solo' then COALESCE(kills, 0) END) /
        avg(CASE
                when team_type = 'solo'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_solo_kdr,

       (avg(CASE when team_type = 'duo' then COALESCE(kills, 0) END) /
        avg(CASE
                when team_type = 'duo'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_duo_kdr,

       (avg(CASE when team_type = 'trio' then COALESCE(kills, 0) END) /
        avg(CASE
                when team_type = 'trio'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_trio_kdr,

       (avg(CASE when team_type = 'quad' then COALESCE(kills, 0) END) /
        avg(CASE
                when team_type = 'quad'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_quad_kdr,



       (avg(CASE when team_type = 'solo' then COALESCE(kills + assists, 0) END) /
        avg(CASE
                when team_type = 'solo'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_solo_kadr,

       (avg(CASE when team_type = 'duo' then COALESCE(kills + assists, 0) END) /
        avg(CASE
                when team_type = 'duo'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_duo_kadr,

       (avg(CASE when team_type = 'trio' then COALESCE(kills + assists, 0) END) /
        avg(CASE
                when team_type = 'trio'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_trio_kadr,

       (avg(CASE when team_type = 'quad' then COALESCE(kills + assists, 0) END) /
        avg(CASE
                when team_type = 'quad'
                    then (CASE WHEN deaths = 0 then 1 else deaths END) END))::real as average_quad_kadr,


       (avg(CASE WHEN team_type = 'solo' then damage_done END))::integer                 as average_solo_damage_done,

       (avg(CASE WHEN team_type = 'duo' then damage_done END))::integer                  as average_duo_damage_done,

       (avg(CASE WHEN team_type = 'trio' then damage_done END))::integer                 as average_trio_damage_done,

       (avg(CASE WHEN team_type = 'quad' then damage_done END))::integer                 as average_quad_damage_done

from warzone._gamer_matches_augmented as gma
where game_category = 'Warzone'
group by uno_id
having count(*) >= 100
   and count(case when team_type = 'solo' then 1 end) >= 5
   and count(case when team_type = 'duo' then 1 end) >= 5
   and count(case when team_type = 'trio' then 1 end) >= 5
   and count(case when team_type = 'quad' then 1 end) >= 5
order by average_quad_placement_percentage asc;