## 概要

文化祭用のウェブサイトのリポジトリです。公演や展示などの情報はJSONファイルで管理し、タイムテーブルなどは自動生成されます。

## festival.json について

このファイルは、文化祭やイベントの公演・展示情報を管理するためのJSONデータです。

### ルートオブジェクト

このJSONファイルのルートは以下の3つのフィールドを持つオブジェクトです。

```json
{
  "festival": { ... },
  "performances": [ ... ],
  "exhibitions": [ ... ]
}
```

---

### `festival`（文化祭情報）

文化祭全体の情報を格納するオブジェクト。

#### フィールド
- `days` (配列): 開催日のリスト

#### `days`の各要素

開催日を表すオブジェクト。

```json
{
  "id": "day-1",
  "date": "2026年XX月XX日",
  "name": "1日目"
}
```

**フィールド:**
- `id` (文字列): 日付の一意識別子。他のオブジェクトから参照するために使用
- `date` (文字列): 実際の開催日付
- `name` (文字列): ユーザーに表示する日付名

---

### `performances`（公演情報）

舞台公演のリストを格納する配列。

#### 各要素の構造

```json
{
  "id": "perf-001",
  "name": "舞台1",
  "organization": "A部",
  "description": "詳細1",
  "schedules": [ ... ]
}
```

**フィールド:**
- `id` (文字列): 公演の一意識別子
- `name` (文字列): 公演名
- `organization` (文字列): 部活・団体名
- `description` (文字列): 公演の詳細説明
- `schedules` (配列): スケジュール情報のリスト

#### `schedules`の各要素

特定の日のスケジュール情報を表すオブジェクト。

```json
{
  "dayId": "day-1",
  "info": [ ... ]
}
```

**フィールド:**
- `dayId` (文字列): 対応する開催日のID（`festival.days[].id`を参照）
- `info` (配列): その日の公演時間と場所のリスト

#### `info`の各要素

具体的な公演時間と場所を表すオブジェクト。

```json
{
  "location": "場所A",
  "startTime": "09:00",
  "endTime": "09:45"
}
```

**フィールド:**
- `location` (文字列): 公演場所
- `startTime` (文字列): 開始時刻（HH:MM形式）
- `endTime` (文字列): 終了時刻（HH:MM形式）

---

### `exhibitions`（展示情報）

展示のリストを格納する配列。

#### 各要素の構造

```json
{
  "id": "exh-001",
  "name": "展示1",
  "organization": "G部",
  "description": "詳細7",
  "roomId": "class_2-9"
}
```

**フィールド:**
- `id` (文字列): 展示の一意識別子
- `name` (文字列): 展示名
- `organization` (文字列): 部活・団体名
- `description` (文字列): 展示の詳細説明
- `roomId` (文字列): 展示が行われる教室・場所のID


### 特定の部屋の展示を取得

1. `exhibitions`を走査し、`roomId`が指定の値に一致するものを抽出

## 地図について

各部屋や階段などには固有のidを振っています。

### レイヤー

|名前|id|
|---|---|
|地階|GF|
|1階|_1F|
|2階|_2F|
|3階|_3F|
|4階|_4F|
|5階|_5F|

### 階層

|名前|id|
|---|---|
|本館地階|honkan_G|
|本館1階|honkan_1|
|本館2階|honkan_2|
|本館3階|honkan_3|
|本館4階|honkan_4|
|講堂棟1階|koudou_1|
|講堂棟2階|koudou_2|
|芸術館1階|geijutsu_1|
|芸術館2階|geijutsu_2|
|科学館1階|kagaku_1|
|科学館2階|kagaku_2|
|科学館3階|kagaku_3|
|科学館4階|kagaku_4|


### 教室

|名前|id|
|---|---|
|1-1|_11|
|1-2|_12|
|1-3|_13|
|1-4|_14|
|1-5|_15|
|1-6|_16|
|1-7|_17|
|1-8|_18|
|1-9|_19|
|2-1|_21|
|2-2|_22|
|2-3|_23|
|2-4|_24|
|2-5|_25|
|2-6|_26|
|2-7|_27|
|2-8|_28|
|2-9|_29|
|3-1|_39|
|3-2|_31|
|3-3|_32|
|3-4|_34|
|3-5|_35|
|3-6|_36|
|3-7|_37|
|3-8|_38|
|3-9|_39|
|LL教室|LL|
|多目的教室|tamokuteki|
|学習室A|gakushuu_A|
|学習室B|gakushuu_B|
|学習室C|gakushuu_C|
|視聴覚教室|sichoukaku|
|地学教室|chigaku|
|家庭教室|katei|
|被服教室|hihuku|
|食物教室|shokumotsu|
|陶芸教室|tougei|
|生物教室|seibutsu|
|化学実験室1|kagaku_zikken_1|
|化学実験室2|kagaku_zikken_2|
|物理教室|butsuri|
|コンピューター教室|computer|
|理科講義室|rika_kougi|

### 準備室

|名前|id|
|---|---|
|体育準備室|taiiku_junbi|
|英語準備室|eigo_junbi|
|地歴準備室・公民準備室|chireki_koumin_junbi|
|国語準備室|kokugo_junbi|
|数学準備室|suugaku_junbi|
|地学準備室|chigaku_junbi|
|被服準備室|hihuku_junbi|
|食物準備室|shokumotsu_junbi|
|生物準備室|seibutsu_junbi|
|化学準備室|kagaku_junbi|
|物理準備室|butsuri_junbi|
|コンピューター準備室|computer_junbi|

### その他部屋

|名前|id|
|---|---|
|食堂|shokudou|
|放送室|housou|
|校務員室|koumuin|
|厨房|chuubou|
|工作室|kousaku|
|自治会室|jichikai|
|校長室|kouchou|
|職員室|shokuin|
|保健室|hoken|
|会議室|kaigi|
|事務室|jimu|
|東神戸資料室|higashikobe|
|校史編集室|koushihenshuu|
|校史記念室|koushikinen|
|進路資料室|sinrosiryou|
|進路指導室|sinrosidou|
|作法室|sahou|
|講堂|koudou|

### エレベーター

|名前|id|
|---|---|
|本館地階|EV_honkan_G|
|本館1階|EV_honkan_1|
|本館2階|EV_honkan_2|
|本館3階|EV_honkan_3|
|本館4階|EV_honkan_4|
|講堂棟1階|EV_koudou_1|
|講堂棟2階|EV_koudou_2|
|科学館1階|EV_kagaku_1|
|科学館2階|EV_kagaku_2|
|科学館3階|EV_kagaku_3|
|科学館4階|EV_kagaku_4|

### 階段

|名前|id|
|---|---|
|本館地階西側|stairs_honkan_G_W|
|本館地階東側|stairs_honkan_G_E|
|本館地階外|stairs_honkan_G_out|
|本館1階西側|stairs_honkan_1_W|
|本館1階東側|stairs_honkan_1_E|
|本館1階宝塚|stairs_honkan_1_takaradsuka|
|本館1階外|stairs_honkan_1_out|
|本館2階西側|stairs_honkan_2_W|
|本館2階東側|stairs_honkan_2_E|
|本館2階宝塚|stairs_honkan_2_takaradsuka|
|本館3階西側|stairs_honkan_3_W|
|本館3階東側|stairs_honkan_3_E|
|本館4階西側|stairs_honkan_4_W|
|本館4階東側|stairs_honkan_4_E|
|講堂棟1階|stairs_kagaku_1|
|講堂棟1階外|stairs_koudou_1_out|
|講堂棟2階|stairs_koudou_2|
|講堂棟2階外|stairs_koudou_2_out|
|科学館1階|stairs_koudou_1|
|科学館2階|stairs_kagaku_2|
|科学館3階|stairs_kagaku_3|
|科学館4階|stairs_kagaku_4|
|外1階|stairs_out_1|
|外2階|stairs_out_2|

### トイレ

|名前|id|
|---|---|
|本館地階西側|WC_honkan_G_W|
|本館地階東側|WC_honkan_G_E|
|本館1階西側|WC_honkan_1_W|
|本館1階東側|WC_honkan_1_E|
|本館2階男子|WC_m_honkan_2|
|本館2階女子|WC_f_honkan_2|
|本館3階女子|WC_f_honkan_3|
|本館3階男子|WC_m_honkan_3|
|本館4階男子|WC_m_honkan_4|
|本館4階女子|WC_f_honkan_4|
|講堂棟1階女子|WC_f_koudou|
|講堂棟1階男子|WC_m_koudou|
|科学館1階|WC_kagaku_1|
|科学館2階|WC_kagaku_2|
|科学館3階|WC_kagaku_3|
|科学館4階|WC_kagaku_4|

