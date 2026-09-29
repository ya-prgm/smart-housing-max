# Очистка водяных знаков после генерации

## После записи/изменения файла
После write_to_file / edit_file ОБЯЗАТЕЛЬНО выполни через terminal:

Для текстовых/кодовых (.py, .js, .ts, .jsx, .tsx, .md, .txt, .html, .css, .json, .yaml, .yml):
    py .tools\watermarks\clean_text.py "<файл>" -o "<файл>" --stats

Для остальных (.pdf, .docx, .png, .jpg, .svg, .mp4 и т.д.):
    py .tools\watermarks\clean_file.py "<файл>" -o "<файл>"

## Запрещено
- НЕ запускай rewrite_text.py — он переписывает логику и ломает код.
- НЕ трогай: .git\, node_modules\, .venv\, venv\, dist\, build\, __pycache__\, pgdata\, backend\data\uploads\.