select kanji, count(kanji)
from japanese_example_kanji
group by kanji
order by count(kanji) desc