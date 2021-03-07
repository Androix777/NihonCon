CREATE TRIGGER trigger_example_add_kanji
    AFTER INSERT OR UPDATE OF row_id, entry OR DELETE
    ON japanese_example 
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_function_example_add_kanji();