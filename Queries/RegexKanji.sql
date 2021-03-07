update japanese_example 
set kanji_count = 
(
	select count(*) from regexp_matches(entry, '[\x3400-\x4DBF\x4E00-\x9FFF\xF900-\xFAFF]', 'g')
)