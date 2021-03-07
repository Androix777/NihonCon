select japanese_example_row_id, selected_kanji_count, kanji_count, entry
from
(
	select japanese_example_row_id, count(kanji) as selected_kanji_count
	from
	(
		select *
		from japanese_example_kanji
		where kanji in ('私', '人')
	) selected_kanji
	group by japanese_example_row_id
) selected_examples
left join japanese_example
on selected_examples.japanese_example_row_id = japanese_example.row_id
where (kanji_count - selected_kanji_count) <= 1 and
kanji_count > 3