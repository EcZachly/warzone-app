select *
from (
         select match_id,
                team,
                array_agg(uno_id) as teammates
         from warzone.gamer_matches gm
         group by match_id, team
     ) as matches
where teammates && '{"12568957784715989620", "15204520028226773877", "7520710210635157767"}'
limit 10;