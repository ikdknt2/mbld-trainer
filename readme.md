
# MBLD Trainer

A simple browser-based training log for **3x3 Multi-Blind (MBLD)**.  
This tool allows you to record attempts, calculate scores automatically, and track your progress.

Data is stored locally in your browser using **IndexedDB**, so no account or server is required.

---

# English

## Features

- Record Multi-Blind attempts  
  - Solved
  - Attempted
  - Time
  - Penalties (+2)
- Automatic score calculation  
- Personal Best (PB) tracking
- Total cubes solved counter
- Sorting options
  - Point
  - Time
  - Solved
  - Date
- CSV import
- Local data storage using IndexedDB

## Score Calculation

Score is calculated using the official Multi-Blind formula:


score = solved − unsolved

Since:

unsolved = attempted − solved


the implementation uses:

```

score = 2 × solved − attempted

```

## DNF Rules

An attempt is marked **DNF** if:

- `score < 0`
- `solved = 1`

Examples:

| Result | Score | Result |
|------|------|------|
| 2/2 | 2 | OK |
| 2/3 | 1 | OK |
| 2/4 | 0 | OK |
| 2/5 | -1 | DNF |
| 1/2 | -1 | DNF |

---

# 日本語

## 概要

このツールは **3x3 Multi-Blind（複数目隠し）** の練習記録を管理するための  
シンプルなブラウザアプリです。

データは **IndexedDB** を使用してブラウザ内に保存されるため、  
アカウントやサーバーは必要ありません。

## 機能

- 試技記録
  - Solved
  - Attempted
  - Time
  - Penalty (+2)
- 自動ポイント計算
- 自己ベスト（PB）表示
- 累計成功キューブ数の表示
- 並び替え
  - Point
  - Time
  - Solved
  - Date
- CSVインポート
- IndexedDBによるローカル保存

## スコア計算

MultiBLDのスコアは次の式で計算されます。

```

score = solved − unsolved

```

unsolved は

```

unsolved = attempted − solved

```

なので、このツールでは

```

score = 2 × solved − attempted

```

として計算しています。

## DNF判定

次のいずれかの場合、試技は **DNF** になります。

- `score < 0`
- `solved = 1`

---

# 中文 (简体)

## 简介

这个工具是一个用于记录 **3x3 多盲 (Multi-Blind)** 训练的简单浏览器应用。

所有数据都会保存在浏览器本地的 **IndexedDB** 中，因此不需要账号或服务器。

## 功能

- 记录 Multi-Blind 成绩
  - Solved
  - Attempted
  - Time
  - Penalty (+2)
- 自动计算分数
- 个人最佳 (PB)
- 总完成方块数量统计
- 排序功能
  - Point
  - Time
  - Solved
  - Date
- CSV 导入
- 使用 IndexedDB 本地存储数据

## 分数计算

Multi-Blind 的分数公式为：

```

score = solved − unsolved

```

由于

```

unsolved = attempted − solved

```

因此程序中使用：

```

score = 2 × solved − attempted

```

## DNF 规则

在以下情况下成绩记为 **DNF**：

- `score < 0`
- `solved = 1`
```
