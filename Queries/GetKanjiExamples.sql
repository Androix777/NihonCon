drop table if exists temp1;
create temporary table temp1
as select * from unnest(array['上', '下', '大', '工', '八', '入', '山', '口', '九', '一', '人', '力', '川', '七', '十', '三', '二', '女', '又', '玉', '本', '子', '丸', '正', '土', '犬', '夕', '出', '目', '了', '火', '五', '四', '才', '手', '天', '王', '左', '中', '月', '々', '田', '右', '六', '小', '立', '丁', '日', '刀', '千', '木', '水', '白', '文', '円', '矢', '市', '牛', '切', '方', '戸', '太', '父', '少', '友', '毛', '半', '心', '内', '生', '台', '母', '午', '北', '今', '古', '元', '外', '分', '公', '引', '止', '用', '万', '広', '冬', '竹', '車', '央', '写', '仕', '耳', '早', '気', '平', '花', '足', '打', '百', '氷', '虫', '字', '男', '主', '名', '不', '号', '他', '去', '皿', '先', '赤', '休', '申', '見', '貝', '石', '代', '礼', '糸', '町', '宝', '村', '世', '年', '角', '斤', '青', '体', '色', '来', '社', '当', '図', '毎', '羽', '林', '行', '金', '草', '里', '作', '多', '肉', '会', '交', '近', '兄', '雨', '米', '走', '同', '言', '自', '形', '皮', '空', '音', '学', '光', '考', '回', '谷', '声', '西', '何', '麦', '弟', '全', '後', '血', '両', '明', '京', '化', '国', '科', '亡', '死', '画', '地', '東', '食', '直', '前', '有', '私', '知', '活', '長', '曲', '首', '次', '夜', '姉', '点', '安', '室', '海', '羊', '店', '南', '星', '州', '茶', '思', '歩', '向', 
						'妹']::character[]) as kanji;
CREATE INDEX "_I_temp_3" ON temp1 USING btree(kanji);

explain analyze select good_examples.entry, japanese_example_origin.entry
from
(
	select japanese_example_row_id, origin, selected_kanji_count, kanji_count, entry
	from
	(
		select japanese_example_row_id, count(kanji) as selected_kanji_count
		from
		(
			select japanese_example_row_id, kanji
			from temp1
			join japanese_example_kanji using (kanji)
		) selected_kanji
		group by japanese_example_row_id
	) selected_examples
	left join japanese_example
	on selected_examples.japanese_example_row_id = japanese_example.row_id
	where (kanji_count - selected_kanji_count) <= 0 and
	kanji_count >= 5 and
	origin > 0
) good_examples
left join japanese_example_origin
on good_examples.origin = japanese_example_origin.row_id