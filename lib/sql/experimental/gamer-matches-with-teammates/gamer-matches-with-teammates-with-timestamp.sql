select match_id,
       team,
       end_time,
       array_agg(uno_id) as teammates
from warzone._gamer_matches_augmented gm
group by match_id, team, end_time
having array_agg(uno_id) && '{"12568957784715989620", "15204520028226773877", "7520710210635157767"}'
order by end_time desc
limit 10;