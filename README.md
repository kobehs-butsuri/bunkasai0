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
- `organization` (文字列): 主催団体・部署名
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
- `organization` (文字列): 主催団体・部署名
- `description` (文字列): 展示の詳細説明
- `roomId` (文字列): 展示が行われる部屋のID


### 特定の部屋の展示を取得

1. `exhibitions`を走査し、`roomId`が指定の値に一致するものを抽出
