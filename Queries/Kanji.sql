select kanji, count(kanji)
from japanese_example_kanji
left join japanese_example
on japanese_example_kanji.japanese_example_row_id = japanese_example.row_id
where origin > 0
group by kanji
order by count(kanji) desc